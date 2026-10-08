import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteBusinessPhoto } from "@/app/actions";
import { AddPhotosForm } from "@/components/add-photos-form";
import { CopyLink } from "@/components/copy-link";
import { getBusinessByToken, getBusinessPhotos } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Manage your listing",
  robots: { index: false, follow: false },
};

export default function ManagePage({ params, searchParams }: PageProps<"/manage/[token]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <ManageListing params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ManageListing({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ token }, sp] = await Promise.all([params, searchParams]);
  const b = await getBusinessByToken(token);
  if (!b) notFound();
  const photos = await getBusinessPhotos(b.id);

  return (
    <div className="space-y-6">
      {sp.new && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          🎉 Your business is live! Share <Link href={`/business/${b.slug}`} className="underline">your listing</Link> with past customers so they can leave reviews.
        </p>
      )}
      {sp.added && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">Photos added — they&apos;re now on your listing.</p>
      )}

      <div>
        <h1 className="text-3xl font-bold">Manage {b.name}</h1>
        <Link href={`/business/${b.slug}`} className="text-brand underline">View your public listing →</Link>
      </div>

      <section className="space-y-3 rounded-2xl bg-accent-soft p-6">
        <h2 className="font-semibold">🔑 Save this private link</h2>
        <p className="text-sm">
          Anyone with this link can change your photos, so don&apos;t share it. Bookmark it or email it to yourself — it&apos;s the only way to get back here.
        </p>
        <CopyLink />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your photos ({photos.length}/20)</h2>
        {photos.length === 0 ? (
          <p className="text-muted">No photos yet. Add some below so families can see the quality of your work.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((p, i) => (
              <div key={p.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- user uploads served by our own route */}
                <img src={`/uploads/${p.file_name}`} alt={`Photo ${i + 1}`} className="aspect-square w-full rounded-xl object-cover ring-1 ring-border" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">Cover photo</span>}
                <form action={deleteBusinessPhoto} className="absolute right-2 top-2">
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="photoId" value={p.id} />
                  <button type="submit" className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-red-700 shadow hover:bg-white">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {photos.length < 20 && <AddPhotosForm token={token} />}
    </div>
  );
}
