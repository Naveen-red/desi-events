"use client";

import { useState, useSyncExternalStore } from "react";

// Shows the current page's address (without the query string) with a copy button.
export function CopyLink() {
  const url = useSyncExternalStore(
    () => () => {},
    () => window.location.origin + window.location.pathname,
    () => "",
  );
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input readOnly value={url} onFocus={(e) => e.target.select()} className="input font-mono text-xs" aria-label="Your private manage link" />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
        }}
        className="btn-primary shrink-0"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
