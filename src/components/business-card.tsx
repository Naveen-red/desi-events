import Link from "next/link";
import { getCategory, PRICE_UNITS } from "@/lib/categories";
import { formatPrice } from "@/lib/metros";
import type { Business } from "@/lib/queries";
import { Stars } from "./stars";

export function BusinessCard({ business: b }: { business: Business }) {
  const category = getCategory(b.category);
  return (
    <Link
      href={`/business/${b.slug}`}
      className="group flex flex-col rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {b.cover_photo && (
        // eslint-disable-next-line @next/next/no-img-element -- user uploads served by our own route
        <img src={`/uploads/${b.cover_photo}`} alt={`Photo from ${b.name}`} className="-mx-5 -mt-5 mb-4 h-40 w-[calc(100%+2.5rem)] max-w-none rounded-t-2xl object-cover" />
      )}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-2xl">
          {category?.icon}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-brand">{formatPrice(b.price, b.metro)}</div>
          <div className="text-xs text-muted">{PRICE_UNITS[b.price_unit]}</div>
        </div>
      </div>
      <h3 className="font-semibold group-hover:text-brand">{b.name}</h3>
      <p className="text-sm text-muted">
        {category?.name} · {b.city}, {b.state}
        {b.capacity ? ` · up to ${b.capacity} guests` : ""}
      </p>
      <div className="mt-2 flex items-center gap-2 text-sm">
        {b.review_count > 0 ? (
          <>
            <Stars rating={b.avg_rating} />
            <span className="font-medium">{b.avg_rating.toFixed(1)}</span>
            <span className="text-muted">({b.review_count})</span>
          </>
        ) : (
          <span className="text-muted">No reviews yet</span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-sm">{b.description}</p>
      {b.is_sample ? (
        <span className="mt-3 self-start rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted">Sample listing</span>
      ) : null}
    </Link>
  );
}
