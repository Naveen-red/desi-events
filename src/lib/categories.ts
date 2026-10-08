export type PriceUnit = "hour" | "event" | "person" | "day" | "item";

export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  defaultUnit: PriceUnit;
};

export const CATEGORIES: Category[] = [
  { slug: "venues", name: "Venues", icon: "🏛️", blurb: "Banquet halls, hotels, farmhouses & temples", defaultUnit: "event" },
  { slug: "caterers", name: "Caterers", icon: "🍛", blurb: "North, South, Gujarati, Indo-Chinese & more", defaultUnit: "person" },
  { slug: "decorators", name: "Decorators", icon: "🌸", blurb: "Mandaps, stage, floral & lighting", defaultUnit: "event" },
  { slug: "bartenders", name: "Bartenders", icon: "🍸", blurb: "Licensed bartenders & bar setups", defaultUnit: "hour" },
  { slug: "photographers", name: "Photo & Video", icon: "📸", blurb: "Photographers, videographers & drones", defaultUnit: "hour" },
  { slug: "djs", name: "DJs & Music", icon: "🎧", blurb: "Bollywood DJs, dhol players & live bands", defaultUnit: "hour" },
  { slug: "rentals", name: "Event Rentals", icon: "🪑", blurb: "Tents, chairs, linens, mandap & baraat horses", defaultUnit: "event" },
  { slug: "bakers", name: "Bakers", icon: "🎂", blurb: "Eggless cakes, desserts & mithai", defaultUnit: "item" },
  { slug: "makeup", name: "Makeup Artists", icon: "💄", blurb: "Bridal makeup, hair & saree draping", defaultUnit: "hour" },
  { slug: "mehndi", name: "Mehndi Artists", icon: "✋", blurb: "Bridal & guest henna", defaultUnit: "hour" },
  { slug: "helpers", name: "Event Helpers", icon: "🙋", blurb: "Servers, setup crew & cleanup", defaultUnit: "hour" },
  { slug: "others", name: "Other Services", icon: "✨", blurb: "Pandits, choreographers, emcees & more", defaultUnit: "hour" },
];

export function getCategory(slug: string | undefined) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const PRICE_UNITS: Record<PriceUnit, string> = {
  hour: "per hour",
  event: "per event",
  person: "per person",
  day: "per day",
  item: "per item",
};

export const EVENT_TYPES = [
  "Wedding",
  "Sangeet",
  "Mehndi",
  "Haldi",
  "Reception",
  "Engagement",
  "Birthday",
  "Baby Shower",
  "Puja / Religious",
  "Graduation",
  "Corporate",
  "Other",
];
