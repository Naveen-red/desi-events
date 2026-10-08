import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BusinessCard } from "@/components/business-card";
import { SearchForm } from "@/components/search-form";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getMetro, METROS } from "@/lib/metros";
import { getCategoryCounts, searchBusinesses, type SearchFilters } from "@/lib/queries";

export const metadata: Metadata = { title: "Find event vendors" };

type Params = Record<string, string | string[] | undefined>;

const SORTS: Record<NonNullable<SearchFilters["sort"]>, string> = {
  rating: "Top rated",
  reviews: "Most reviewed",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInt(value: string | undefined) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Suspense fallback={<p className="text-muted">Loading vendors…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const metro = getMetro(one(sp.metro)) ?? METROS[0];
  const category = getCategory(one(sp.category));
  const sortParam = one(sp.sort);
  const sort = sortParam && sortParam in SORTS ? (sortParam as keyof typeof SORTS) : "rating";
  const max = one(sp.max);
  const guests = one(sp.guests);

  const filters: SearchFilters = {
    metro: metro.slug,
    category: category?.slug,
    maxPrice: positiveInt(max),
    guests: positiveInt(guests),
    minRating: positiveInt(one(sp.rating)),
    sort,
  };
  const [results, counts] = await Promise.all([searchBusinesses(filters), getCategoryCounts(metro.slug)]);

  const linkWith = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { metro: metro.slug, category: category?.slug, max, guests, sort, ...changes };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    return `/search?${next}`;
  };

  return (
    <>
      <SearchForm compact defaults={{ metro: metro.slug, category: category?.slug, max, guests }} />

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Chip href={linkWith({ category: undefined })} active={!category}>All</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.slug} href={linkWith({ category: c.slug })} active={category?.slug === c.slug}>
            {c.icon} {c.name} {counts[c.slug] ? <span className="opacity-60">({counts[c.slug]})</span> : null}
          </Chip>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">
          {results.length} {category ? category.name.toLowerCase() : "vendors"} in {metro.name}
        </h1>
        <div className="flex gap-2 text-sm">
          {Object.entries(SORTS).map(([key, label]) => (
            <Link
              key={key}
              href={linkWith({ sort: key })}
              className={key === sort ? "font-semibold text-brand underline" : "text-muted hover:text-brand"}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-card p-10 text-center ring-1 ring-border">
          <p className="text-lg font-semibold">No vendors match yet.</p>
          <p className="mt-1 text-muted">
            Try a higher budget or a different category — or{" "}
            <Link href="/list-your-business" className="text-brand underline">add a vendor you know</Link>.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 ${
        active ? "bg-brand text-white ring-brand" : "bg-white ring-border hover:ring-brand"
      }`}
    >
      {children}
    </Link>
  );
}
