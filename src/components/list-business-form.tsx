"use client";

import { useActionState, useState } from "react";
import { createBusiness, type FormState } from "@/app/actions";
import { submitWithoutReset } from "@/lib/forms";
import { CATEGORIES, getCategory, PRICE_UNITS } from "@/lib/categories";
import { METROS } from "@/lib/metros";
import { SocialLinksInput } from "./social-links-input";

export function ListBusinessForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createBusiness, undefined);
  const [category, setCategory] = useState("");
  const [priceUnit, setPriceUnit] = useState("hour");

  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-5 rounded-2xl bg-card p-6 ring-1 ring-border">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Business name *</label>
          <input id="name" name="name" required maxLength={100} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            required
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPriceUnit(getCategory(e.target.value)?.defaultUnit ?? "hour");
            }}
            className="input"
          >
            <option value="" disabled>Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="metro">Metro area *</label>
          <select id="metro" name="metro" required defaultValue="" className="input">
            <option value="" disabled>Select…</option>
            {METROS.map((m) => (
              <option key={m.slug} value={m.slug}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="city">City *</label>
          <input id="city" name="city" required maxLength={60} className="input" placeholder="e.g. Irving" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="state">State / Prov. *</label>
            <input id="state" name="state" required maxLength={2} className="input uppercase" placeholder="TX" />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP / Postal</label>
            <input id="zip" name="zip" maxLength={10} className="input" />
          </div>
        </div>
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-semibold">Pricing</legend>
        <div>
          <label className="label" htmlFor="price">Starting price *</label>
          <input id="price" name="price" type="number" min={1} required inputMode="numeric" className="input" placeholder="150" />
        </div>
        <div>
          <label className="label" htmlFor="priceUnit">Charged *</label>
          <select id="priceUnit" name="priceUnit" value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)} className="input">
            {Object.entries(PRICE_UNITS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {category === "venues" && (
          <div>
            <label className="label" htmlFor="capacity">Max guest capacity</label>
            <input id="capacity" name="capacity" type="number" min={1} inputMode="numeric" className="input" placeholder="300" />
          </div>
        )}
      </fieldset>

      <div>
        <label className="label" htmlFor="description">About your business</label>
        <textarea id="description" name="description" rows={4} maxLength={1500} className="input" placeholder="What do you offer? What makes you special? Minimums, packages, travel area…" />
      </div>
      <div>
        <label className="label" htmlFor="languages">Languages spoken</label>
        <input id="languages" name="languages" maxLength={120} className="input" placeholder="English, Hindi, Telugu" />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-semibold">Contact (phone or email required)</legend>
        <div>
          <label className="label" htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" maxLength={30} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" maxLength={120} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="website">Website</label>
          <input id="website" name="website" maxLength={200} className="input" placeholder="www.example.com" />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold">Social media</legend>
        <p className="mb-2 text-sm text-muted">Instagram, Facebook, YouTube, TikTok or any other page that shows your work. You can change these later.</p>
        <SocialLinksInput />
      </fieldset>

      <div>
        <label className="label" htmlFor="photos">Photos of your work (up to 5, max 5 MB each)</label>
        <p className="mb-2 text-sm text-muted">
          Show off past events — decor, food, venue setups. Listings with photos get far more attention. You can add more later.
        </p>
        <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Publishing…" : "Publish my listing"}
      </button>
    </form>
  );
}
