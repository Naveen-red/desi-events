import { describeLink } from "@/lib/social";

export function SocialLinks({ links, className }: { links: string[]; className?: string }) {
  return (
    <div className={className}>
      {links.map((href) => {
        const { name, icon, handle } = describeLink(href);
        return (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block truncate rounded-lg border border-border px-3 py-2 hover:border-brand hover:text-brand"
          >
            {icon} {name}
            {handle && <span className="text-muted"> · {handle}</span>}
          </a>
        );
      })}
    </div>
  );
}
