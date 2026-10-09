import "server-only";
import { connection } from "next/server";
import { db } from "./db";
import type { PriceUnit } from "./categories";

export type Business = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  metro: string;
  city: string;
  state: string;
  zip: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  price: number;
  price_unit: PriceUnit;
  capacity: number | null;
  languages: string;
  is_sample: number;
  cover_photo: string | null;
  avg_rating: number;
  review_count: number;
};

export type Review = {
  id: number;
  reviewer_name: string;
  rating: number;
  event_type: string | null;
  comment: string;
  created_at: string;
  photos: string[];
};

export type BusinessPhoto = {
  id: number;
  file_name: string;
};

export type SearchFilters = {
  metro: string;
  category?: string;
  maxPrice?: number;
  guests?: number;
  minRating?: number;
  sort?: "rating" | "price_asc" | "price_desc" | "reviews";
};

const BUSINESS_COLUMNS = `
  b.*,
  (SELECT file_name FROM business_photos WHERE business_id = b.id ORDER BY id LIMIT 1) AS cover_photo,
  COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
  COUNT(r.id) AS review_count`;

const ORDER_BY: Record<NonNullable<SearchFilters["sort"]>, string> = {
  rating: "avg_rating DESC, review_count DESC, b.name",
  reviews: "review_count DESC, avg_rating DESC, b.name",
  price_asc: "b.price ASC, b.name",
  price_desc: "b.price DESC, b.name",
};

// node:sqlite is synchronous, so Next.js would otherwise treat these reads as
// build-time constants. connection() makes them run on every request.

export async function searchBusinesses(f: SearchFilters): Promise<Business[]> {
  await connection();
  const where = ["b.metro = ?"];
  const params: (string | number)[] = [f.metro];

  if (f.category) {
    where.push("b.category = ?");
    params.push(f.category);
  }
  if (f.maxPrice) {
    where.push("b.price <= ?");
    params.push(f.maxPrice);
  }
  if (f.guests) {
    // Capacity only applies to venues; other vendors have no capacity set.
    where.push("(b.capacity IS NULL OR b.capacity >= ?)");
    params.push(f.guests);
  }

  const having = f.minRating ? "HAVING avg_rating >= ?" : "";
  if (f.minRating) params.push(f.minRating);

  const sql = `
    SELECT ${BUSINESS_COLUMNS}
    FROM businesses b LEFT JOIN reviews r ON r.business_id = b.id
    WHERE ${where.join(" AND ")}
    GROUP BY b.id
    ${having}
    ORDER BY ${ORDER_BY[f.sort ?? "rating"]}`;
  return db.prepare(sql).all(...params) as Business[];
}

export async function getBusiness(slug: string): Promise<Business | undefined> {
  await connection();
  return db
    .prepare(
      `SELECT ${BUSINESS_COLUMNS}
       FROM businesses b LEFT JOIN reviews r ON r.business_id = b.id
       WHERE b.slug = ?
       GROUP BY b.id`,
    )
    .get(slug) as Business | undefined;
}

// Looks up a listing by the secret in its owner's private manage link.
export async function getBusinessByToken(token: string): Promise<Business | undefined> {
  await connection();
  return db
    .prepare(
      `SELECT ${BUSINESS_COLUMNS}
       FROM businesses b LEFT JOIN reviews r ON r.business_id = b.id
       WHERE b.manage_token = ?
       GROUP BY b.id`,
    )
    .get(token) as Business | undefined;
}

export async function getBusinessPhotos(businessId: number): Promise<BusinessPhoto[]> {
  await connection();
  return db
    .prepare("SELECT id, file_name FROM business_photos WHERE business_id = ? ORDER BY id")
    .all(businessId) as BusinessPhoto[];
}

export async function getBusinessLinks(businessId: number): Promise<string[]> {
  await connection();
  const rows = db.prepare("SELECT url FROM business_links WHERE business_id = ? ORDER BY id").all(businessId) as { url: string }[];
  return rows.map((r) => r.url);
}

export async function getReviews(businessId: number): Promise<Review[]> {
  await connection();
  const rows = db
    .prepare(
      `SELECT r.*, GROUP_CONCAT(p.file_name) AS photo_list
       FROM reviews r LEFT JOIN review_photos p ON p.review_id = r.id
       WHERE r.business_id = ?
       GROUP BY r.id
       ORDER BY r.created_at DESC`,
    )
    .all(businessId) as (Omit<Review, "photos"> & { photo_list: string | null })[];
  return rows.map(({ photo_list, ...r }) => ({
    ...r,
    photos: photo_list ? photo_list.split(",") : [],
  }));
}

export async function getCategoryCounts(metro: string): Promise<Record<string, number>> {
  await connection();
  const rows = db
    .prepare("SELECT category, COUNT(*) AS n FROM businesses WHERE metro = ? GROUP BY category")
    .all(metro) as { category: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.category, r.n]));
}
