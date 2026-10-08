"use client";

import { useActionState, useState } from "react";
import { submitReview, type FormState } from "@/app/actions";
import { EVENT_TYPES } from "@/lib/categories";

export function ReviewForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitReview, undefined);
  const [rating, setRating] = useState(0);

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border">
      <h3 className="text-lg font-semibold">Hired them? Leave a review</h3>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <span className="label">Your rating</span>
        <div className="flex gap-1 text-3xl" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className={n <= rating ? "text-accent" : "text-border hover:text-accent/60"}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" name="name" required maxLength={60} className="input" placeholder="e.g. Anjali R." />
        </div>
        <div>
          <label className="label" htmlFor="eventType">Event</label>
          <select id="eventType" name="eventType" className="input" defaultValue="">
            <option value="">Select…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="comment">Your experience</label>
        <textarea id="comment" name="comment" required minLength={10} maxLength={2000} rows={4} className="input" placeholder="How was the service, quality, punctuality and price?" />
      </div>

      <div>
        <label className="label" htmlFor="photos">Photos from your event (up to 5, max 5 MB each)</label>
        <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
