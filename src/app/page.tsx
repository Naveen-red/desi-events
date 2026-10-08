import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { CATEGORIES } from "@/lib/categories";
import { SITE_TAGLINE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-accent-soft to-background px-4 pb-12 pt-14">
        <div className="mx-auto max-w-6xl">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Everything for your <span className="text-brand">shaadi, sangeet &amp; celebrations</span> — in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {SITE_TAGLINE}. Compare venues, caterers, decorators, DJs, photographers and mehndi artists near you — with real prices and reviews.
          </p>
          <div className="mt-8">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Browse by service</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/search?metro=dfw&category=${c.slug}`}
              className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-2 font-semibold">{c.name}</div>
              <div className="text-sm text-muted">{c.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["🔍", "Search your city", "Pick your metro area, budget and guest count to see vendors that fit."],
            ["⭐", "Read real reviews", "See ratings and photos from families who hired them for their own events."],
            ["📞", "Contact directly", "Call, email or DM vendors directly — no middleman, no booking fees."],
          ].map(([icon, title, body]) => (
            <div key={title} className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <div className="text-2xl">{icon}</div>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-brand p-8 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold">Are you an event vendor?</h3>
            <p className="text-white/80">List your business for free and reach families planning events in your area.</p>
          </div>
          <Link href="/list-your-business" className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-foreground sm:mt-0">
            List your business
          </Link>
        </div>
      </section>
    </>
  );
}
