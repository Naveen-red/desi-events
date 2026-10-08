import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Serves review and business photos saved by the actions in app/actions.ts. Only accepts the UUID file
// names we generate, so no path traversal is possible.
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  const match = /^[0-9a-f-]{36}\.(jpg|png|webp)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, file));
    return new Response(data, {
      headers: {
        "Content-Type": CONTENT_TYPES[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
