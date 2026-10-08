"use client";

import { useActionState } from "react";
import { addBusinessPhotos, type FormState } from "@/app/actions";

export function AddPhotosForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addBusinessPhotos, undefined);

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border">
      <h2 className="text-lg font-semibold">Add photos</h2>
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="label" htmlFor="photos">Up to 5 at a time, max 5 MB each (JPG, PNG or WebP)</label>
        <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required className="text-sm" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Uploading…" : "Upload photos"}
      </button>
    </form>
  );
}
