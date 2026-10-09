"use client";

import { useActionState } from "react";
import { updateSocialLinks, type FormState } from "@/app/actions";
import { SocialLinksInput } from "./social-links-input";

export function EditSocialLinksForm({ token, links }: { token: string; links: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateSocialLinks, undefined);

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border">
      <div>
        <h2 className="text-lg font-semibold">Social media links</h2>
        <p className="text-sm text-muted">Instagram, Facebook, YouTube, TikTok, WhatsApp — paste a link to any page where families can see your work.</p>
      </div>
      <input type="hidden" name="token" value={token} />
      <SocialLinksInput defaultLinks={links} />

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : "Save links"}
      </button>
    </form>
  );
}
