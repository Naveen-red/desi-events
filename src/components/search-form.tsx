import { CATEGORIES } from "@/lib/categories";
import { METROS } from "@/lib/metros";

export type SearchDefaults = {
  metro?: string;
  category?: string;
  max?: string;
  guests?: string;
};

/** Plain GET form so search results are shareable URLs. */
export function SearchForm({ defaults = {}, compact = false }: { defaults?: SearchDefaults; compact?: boolean }) {
  return (
    <form
      action="/search"
      className={`grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border ${
        compact ? "sm:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-5"
      }`}
    >
      <div className="lg:col-span-1">
        <label className="label" htmlFor="metro">Location</label>
        <select id="metro" name="metro" defaultValue={defaults.metro ?? "dfw"} className="input">
          <optgroup label="USA">
            {METROS.filter((m) => m.country === "US").map((m) => (
              <option key={m.slug} value={m.slug}>{m.name}</option>
            ))}
          </optgroup>
          <optgroup label="Canada">
            {METROS.filter((m) => m.country === "CA").map((m) => (
              <option key={m.slug} value={m.slug}>{m.name}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="category">Looking for</label>
        <select id="category" name="category" defaultValue={defaults.category ?? ""} className="input">
          <option value="">All services</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="max">Max budget ($)</label>
        <input id="max" name="max" type="number" min={1} inputMode="numeric" placeholder="Any" defaultValue={defaults.max} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="guests">Guests</label>
        <input id="guests" name="guests" type="number" min={1} inputMode="numeric" placeholder="e.g. 300" defaultValue={defaults.guests} className="input" />
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full">Search</button>
      </div>
    </form>
  );
}
