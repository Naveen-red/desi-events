import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — Indian event vendors in the USA & Canada`, template: `%s · ${SITE_NAME}` },
  description: `${SITE_TAGLINE}. Find venues, caterers, decorators, DJs, photographers, mehndi artists and more near you.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-10">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-xl font-bold text-brand">
              🪔 {SITE_NAME}
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/search?metro=dfw" className="hidden hover:text-brand sm:inline">
                Browse vendors
              </Link>
              <Link href="/list-your-business" className="rounded-lg border border-brand px-3 py-1.5 text-brand hover:bg-brand hover:text-white">
                List your business — free
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          <p>
            {SITE_NAME} · Made for the Indian community in the USA &amp; Canada 🇺🇸 🇨🇦
          </p>
        </footer>
      </body>
    </html>
  );
}
