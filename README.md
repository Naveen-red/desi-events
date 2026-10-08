# DesiEvents

A directory that helps Indian families in the USA and Canada plan weddings, sangeets, pujas and other celebrations. Search venues, caterers, decorators, bartenders, photographers, DJs, event rentals, bakers, makeup artists, mehndi artists, helpers and more, filtered by location, budget and guest count. Compare prices, read reviews with photos, and contact vendors directly.

Listing is free for vendors for now.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node 22.13+ (uses the built-in `node:sqlite`). On first run, `data/app.db` is created and filled with **fictional sample listings** (labelled "Sample listing" in the UI). To start fresh, delete the `data/` folder.

## How it's built

- **Next.js 16** (App Router, Cache Components) + **Tailwind CSS 4**
- **SQLite** via `node:sqlite`. Schema is in `src/lib/db.ts` and queries in `src/lib/queries.ts`
- Review photos are saved to `data/uploads/` and served by `src/app/uploads/[file]/route.ts`

| Page | File |
| --- | --- |
| Home + search | `src/app/page.tsx` |
| Search results | `src/app/search/page.tsx` |
| Business profile + reviews | `src/app/business/[slug]/page.tsx` |
| List your business | `src/app/list-your-business/page.tsx` |
| Form handlers (review, new listing) | `src/app/actions.ts` |

Categories live in `src/lib/categories.ts`, metro areas in `src/lib/metros.ts`, and the brand name in `src/lib/site.ts`.
