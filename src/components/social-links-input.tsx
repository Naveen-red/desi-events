"use client";

import { useState } from "react";
import { MAX_SOCIAL_LINKS } from "@/lib/social";

const PLACEHOLDERS = ["instagram.com/yourpage", "facebook.com/yourpage", "youtube.com/@yourchannel"];

// A growable list of link inputs, all submitted under the name "socialLinks".
export function SocialLinksInput({ defaultLinks = [] }: { defaultLinks?: string[] }) {
  const [links, setLinks] = useState(() => [...defaultLinks, "", "", ""].slice(0, Math.max(defaultLinks.length + 1, 3)));

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <input
          key={i}
          name="socialLinks"
          value={link}
          onChange={(e) => setLinks(links.map((l, j) => (j === i ? e.target.value : l)))}
          maxLength={300}
          inputMode="url"
          className="input"
          placeholder={PLACEHOLDERS[i] ?? "tiktok.com/@you, pinterest.com/you, …"}
          aria-label={`Social media link ${i + 1}`}
        />
      ))}
      {links.length < MAX_SOCIAL_LINKS && (
        <button type="button" onClick={() => setLinks([...links, ""])} className="text-sm font-medium text-brand hover:underline">
          + Add another link
        </button>
      )}
    </div>
  );
}
