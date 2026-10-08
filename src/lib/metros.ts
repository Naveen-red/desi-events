export type Metro = {
  slug: string;
  name: string;
  country: "US" | "CA";
  /** Cities shown as hints in the "list your business" form. */
  cities: string[];
};

export const METROS: Metro[] = [
  { slug: "dfw", name: "Dallas–Fort Worth, TX", country: "US", cities: ["Dallas", "Irving", "Plano", "Frisco", "Arlington", "Fort Worth", "Richardson", "Coppell"] },
  { slug: "houston", name: "Houston, TX", country: "US", cities: ["Houston", "Sugar Land", "Katy", "Pearland"] },
  { slug: "austin", name: "Austin, TX", country: "US", cities: ["Austin", "Round Rock", "Cedar Park"] },
  { slug: "bay-area", name: "SF Bay Area, CA", country: "US", cities: ["San Jose", "Fremont", "Sunnyvale", "Santa Clara"] },
  { slug: "socal", name: "Los Angeles / Orange County, CA", country: "US", cities: ["Artesia", "Irvine", "Cerritos"] },
  { slug: "nyc-nj", name: "New York / New Jersey", country: "US", cities: ["Edison", "Jersey City", "Iselin", "Queens"] },
  { slug: "chicago", name: "Chicago, IL", country: "US", cities: ["Chicago", "Schaumburg", "Naperville"] },
  { slug: "atlanta", name: "Atlanta, GA", country: "US", cities: ["Alpharetta", "Duluth", "Cumming"] },
  { slug: "seattle", name: "Seattle, WA", country: "US", cities: ["Seattle", "Bellevue", "Redmond"] },
  { slug: "dc", name: "Washington DC / Virginia", country: "US", cities: ["Ashburn", "Herndon", "Fairfax"] },
  { slug: "toronto", name: "Toronto / GTA, ON", country: "CA", cities: ["Toronto", "Brampton", "Mississauga", "Markham"] },
  { slug: "vancouver", name: "Vancouver, BC", country: "CA", cities: ["Surrey", "Vancouver", "Burnaby"] },
  { slug: "calgary", name: "Calgary, AB", country: "CA", cities: ["Calgary"] },
];

export function getMetro(slug: string | undefined) {
  return METROS.find((m) => m.slug === slug);
}

export function formatPrice(amount: number, metroSlug: string) {
  const currency = getMetro(metroSlug)?.country === "CA" ? "CAD" : "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
