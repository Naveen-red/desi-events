import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReviewForm } from "@/components/review-form";
import { Stars } from "@/components/stars";
import { getCategory, PRICE_UNITS } from "@/lib/categories";
import { formatPrice, getMetro } from "@/lib/metros";
import { getBusiness, getBusinessPhotos, getReviews } from "@/lib/queries";

export default function BusinessPage({ params, searchParams }: PageProps<"/business/[slug]">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <BusinessDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function BusinessDetails({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const b = await getBusiness(slug);
  if (!b) notFound();
  const [reviews, photos] = await Promise.all([getReviews(b.id), getBusinessPhotos(b.id)]);
  const category = getCategory(b.category);
  const metro = getMetro(b.metro);

  return (
    <>
      <nav className="mb-4 text-sm text-muted">
        <Link href={`/search?metro=${b.metro}`} className="hover:text-brand">{metro?.name}</Link>
        {" / "}
        <Link href={`/search?metro=${b.metro}&category=${b.category}`} className="hover:text-brand">{category?.name}</Link>
      </nav>

      {sp.reviewed && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">Thanks — your review has been posted.</p>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <section className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-4xl">{category?.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{b.name}</h1>
              <p className="text-muted">
                {category?.name} · {b.city}, {b.state}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                {b.review_count > 0 ? (
                  <>
                    <Stars rating={b.avg_rating} />
                    <span className="font-medium">{b.avg_rating.toFixed(1)}</span>
                    <a href="#reviews" className="text-muted underline">{b.review_count} review{b.review_count === 1 ? "" : "s"}</a>
                  </>
                ) : (
                  <span className="text-muted">No reviews yet</span>
                )}
                {b.is_sample ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted">Sample listing</span> : null}
              </div>
            </div>
          </div>
          {b.description && <p className="mt-5 whitespace-pre-line">{b.description}</p>}
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {b.capacity ? <Detail label="Capacity">Up to {b.capacity} guests</Detail> : null}
            {b.languages ? <Detail label="Languages">{b.languages}</Detail> : null}
          </dl>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <div className="text-sm text-muted">Starting at</div>
            <div className="text-3xl font-bold text-brand">{formatPrice(b.price, b.metro)}</div>
            <div className="text-sm text-muted">{PRICE_UNITS[b.price_unit]}</div>
            <div className="mt-5 space-y-2 text-sm">
              {b.phone && <ContactLink href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>📞 {b.phone}</ContactLink>}
              {b.email && <ContactLink href={`mailto:${b.email}`}>✉️ {b.email}</ContactLink>}
              {b.website && <ContactLink href={/^https?:\/\//.test(b.website) ? b.website : `https://${b.website}`}>🌐 Website</ContactLink>}
              {b.instagram && <ContactLink href={`https://instagram.com/${b.instagram}`}>📷 @{b.instagram}</ContactLink>}
            </div>
          </div>
        </aside>
      </div>

      {photos.length > 0 && (
        <section id="photos" className="mt-10 scroll-mt-20">
          <h2 className="mb-4 text-xl font-bold">Photos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((p) => (
              <a key={p.id} href={`/uploads/${p.file_name}`} target="_blank">
                {/* eslint-disable-next-line @next/next/no-img-element -- user uploads served by our own route */}
                <img src={`/uploads/${p.file_name}`} alt={`Photo from ${b.name}`} className="aspect-square w-full rounded-xl object-cover ring-1 ring-border" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section id="reviews" className="mt-10 scroll-mt-20">
        <h2 className="mb-4 text-xl font-bold">Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-muted">Be the first to review {b.name}.</p>}
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl bg-card p-5 ring-1 ring-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">{r.reviewer_name}</span>
                  {r.event_type && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs">{r.event_type}</span>}
                </div>
                <span className="text-sm text-muted">{new Date(r.created_at + "Z").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
              <Stars rating={r.rating} className="mt-1 block" />
              <p className="mt-2 whitespace-pre-line text-sm">{r.comment}</p>
              {r.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.photos.map((p) => (
                    <a key={p} href={`/uploads/${p}`} target="_blank">
                      {/* eslint-disable-next-line @next/next/no-img-element -- user uploads served by our own route */}
                      <img src={`/uploads/${p}`} alt={`Photo from ${r.reviewer_name}'s event`} className="h-24 w-24 rounded-lg object-cover ring-1 ring-border" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
          <ReviewForm slug={b.slug} />
        </div>
      </section>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block rounded-lg border border-border px-3 py-2 hover:border-brand hover:text-brand">
      {children}
    </a>
  );
}
