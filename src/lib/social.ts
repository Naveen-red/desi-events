export const MAX_SOCIAL_LINKS = 8;

const PLATFORMS = [
  { name: "Instagram", icon: "📷", hosts: ["instagram.com"] },
  { name: "Facebook", icon: "📘", hosts: ["facebook.com", "fb.com", "fb.me"] },
  { name: "YouTube", icon: "▶️", hosts: ["youtube.com", "youtu.be"] },
  { name: "TikTok", icon: "🎵", hosts: ["tiktok.com"] },
  { name: "WhatsApp", icon: "💬", hosts: ["wa.me", "whatsapp.com"] },
  { name: "Pinterest", icon: "📌", hosts: ["pinterest.com", "pin.it"] },
  { name: "X", icon: "𝕏", hosts: ["x.com", "twitter.com"] },
  { name: "Threads", icon: "🧵", hosts: ["threads.net", "threads.com"] },
  { name: "LinkedIn", icon: "💼", hosts: ["linkedin.com"] },
  { name: "Snapchat", icon: "👻", hosts: ["snapchat.com"] },
  { name: "Yelp", icon: "⭐", hosts: ["yelp.com", "yelp.ca"] },
];

/** Turns what an owner typed into a full https link, or null if it isn't a web address. */
export function normalizeLink(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(value) ? value : `https://${value}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Platform name, icon and a short label (e.g. "@saffronevents") for a saved link. */
export function describeLink(href: string) {
  const url = new URL(href);
  const host = url.hostname.replace(/^(www|m|mobile)\./, "");
  const platform = PLATFORMS.find((p) => p.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
  if (!platform) return { name: host, icon: "🔗", handle: null };
  const first = url.pathname.split("/").find(Boolean);
  const handle = first && !["p", "reel", "watch", "channel", "pages", "profile.php", "in", "company"].includes(first)
    ? `@${decodeURIComponent(first).replace(/^@/, "")}`
    : null;
  return { name: platform.name, icon: platform.icon, handle };
}
