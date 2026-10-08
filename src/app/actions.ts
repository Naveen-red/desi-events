"use server";

import { randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { db, transaction, UPLOAD_DIR } from "@/lib/db";
import { getCategory, PRICE_UNITS, type PriceUnit } from "@/lib/categories";
import { getMetro } from "@/lib/metros";

export type FormState = { error?: string } | undefined;

const MAX_PHOTOS = 5; // per upload; keeps requests under the server action body limit
const MAX_BUSINESS_PHOTOS = 20;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function text(formData: FormData, key: string, maxLength = 200) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getPhotos(formData: FormData) {
  return formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
}

function validatePhotos(photos: File[]): string | undefined {
  if (photos.length > MAX_PHOTOS) return `You can upload up to ${MAX_PHOTOS} photos at a time.`;
  for (const photo of photos) {
    if (!PHOTO_TYPES[photo.type]) return `${photo.name}: only JPG, PNG or WebP photos are supported.`;
    if (photo.size > MAX_PHOTO_BYTES) return `${photo.name} is larger than 5 MB.`;
  }
}

async function savePhotos(photos: File[]): Promise<string[]> {
  const fileNames: string[] = [];
  for (const photo of photos) {
    const fileName = `${randomUUID()}.${PHOTO_TYPES[photo.type]}`;
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, fileName), Buffer.from(await photo.arrayBuffer()));
    fileNames.push(fileName);
  }
  return fileNames;
}

function getManagedBusiness(token: string) {
  return db.prepare("SELECT id, slug FROM businesses WHERE manage_token = ?").get(token) as
    | { id: number; slug: string }
    | undefined;
}

export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const slug = text(formData, "slug");
  const business = db.prepare("SELECT id FROM businesses WHERE slug = ?").get(slug) as
    | { id: number }
    | undefined;
  if (!business) return { error: "This business no longer exists." };

  const name = text(formData, "name", 60);
  const rating = Number(formData.get("rating"));
  const eventType = text(formData, "eventType", 40) || null;
  const comment = text(formData, "comment", 2000);

  if (!name) return { error: "Please enter your name." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a rating from 1 to 5 stars." };
  if (comment.length < 10) return { error: "Please write at least a sentence about your experience." };

  const photos = getPhotos(formData);
  const photoError = validatePhotos(photos);
  if (photoError) return { error: photoError };
  const fileNames = await savePhotos(photos);

  transaction(() => {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO reviews (business_id, reviewer_name, rating, event_type, comment) VALUES (?, ?, ?, ?, ?)")
      .run(business.id, name, rating, eventType, comment);
    const insertPhoto = db.prepare("INSERT INTO review_photos (review_id, file_name) VALUES (?, ?)");
    for (const fileName of fileNames) insertPhoto.run(lastInsertRowid, fileName);
  });

  redirect(`/business/${slug}?reviewed=1#reviews`);
}

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = text(formData, "name", 100);
  const category = text(formData, "category");
  const metro = text(formData, "metro");
  const city = text(formData, "city", 60);
  const state = text(formData, "state", 2).toUpperCase();
  const price = Math.round(Number(formData.get("price")));
  const priceUnit = text(formData, "priceUnit") as PriceUnit;
  const capacityRaw = text(formData, "capacity");
  const capacity = capacityRaw ? Math.round(Number(capacityRaw)) : null;
  const phone = text(formData, "phone", 30) || null;
  const email = text(formData, "email", 120) || null;

  if (!name) return { error: "Please enter your business name." };
  if (!getCategory(category)) return { error: "Please choose a category." };
  if (!getMetro(metro)) return { error: "Please choose your metro area." };
  if (!city) return { error: "Please enter your city." };
  if (!/^[A-Z]{2}$/.test(state)) return { error: "Please enter a 2-letter state or province code (e.g. TX, ON)." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Please enter your starting price." };
  if (!(priceUnit in PRICE_UNITS)) return { error: "Please choose how you charge." };
  if (capacity !== null && (!Number.isFinite(capacity) || capacity <= 0)) return { error: "Capacity must be a number of guests." };
  if (!phone && !email) return { error: "Please add a phone number or email so customers can reach you." };

  const photos = getPhotos(formData);
  const photoError = validatePhotos(photos);
  if (photoError) return { error: photoError };

  const base = `${slugify(name)}-${slugify(city)}`;
  let slug = base;
  for (let i = 2; db.prepare("SELECT 1 FROM businesses WHERE slug = ?").get(slug); i++) slug = `${base}-${i}`;

  const token = randomBytes(24).toString("base64url");
  const fileNames = await savePhotos(photos);

  transaction(() => {
    const { lastInsertRowid } = db.prepare(
      `INSERT INTO businesses
         (slug, name, category, description, metro, city, state, zip, phone, email, website, instagram, price, price_unit, capacity, languages, manage_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      slug,
      name,
      category,
      text(formData, "description", 1500),
      metro,
      city,
      state,
      text(formData, "zip", 10) || null,
      phone,
      email,
      text(formData, "website", 200) || null,
      text(formData, "instagram", 60).replace(/^@/, "") || null,
      price,
      priceUnit,
      category === "venues" ? capacity : null,
      text(formData, "languages", 120),
      token,
    );
    const insertPhoto = db.prepare("INSERT INTO business_photos (business_id, file_name) VALUES (?, ?)");
    for (const fileName of fileNames) insertPhoto.run(lastInsertRowid, fileName);
  });

  redirect(`/manage/${token}?new=1`);
}

export async function addBusinessPhotos(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = text(formData, "token");
  const business = getManagedBusiness(token);
  if (!business) return { error: "This manage link is not valid." };

  const photos = getPhotos(formData);
  if (photos.length === 0) return { error: "Please choose at least one photo." };
  const photoError = validatePhotos(photos);
  if (photoError) return { error: photoError };

  const { n } = db.prepare("SELECT COUNT(*) AS n FROM business_photos WHERE business_id = ?").get(business.id) as { n: number };
  if (n + photos.length > MAX_BUSINESS_PHOTOS) {
    return { error: `Listings can have up to ${MAX_BUSINESS_PHOTOS} photos. You have room for ${MAX_BUSINESS_PHOTOS - n} more.` };
  }

  const fileNames = await savePhotos(photos);
  transaction(() => {
    const insertPhoto = db.prepare("INSERT INTO business_photos (business_id, file_name) VALUES (?, ?)");
    for (const fileName of fileNames) insertPhoto.run(business.id, fileName);
  });

  redirect(`/manage/${token}?added=${fileNames.length}`);
}

export async function deleteBusinessPhoto(formData: FormData) {
  const token = text(formData, "token");
  const business = getManagedBusiness(token);
  if (!business) return;

  const photo = db
    .prepare("SELECT id, file_name FROM business_photos WHERE id = ? AND business_id = ?")
    .get(Number(formData.get("photoId")), business.id) as { id: number; file_name: string } | undefined;
  if (photo) {
    db.prepare("DELETE FROM business_photos WHERE id = ?").run(photo.id);
    await fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, photo.file_name), { force: true });
  }

  redirect(`/manage/${token}`);
}
