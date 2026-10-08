import type { DatabaseSync } from "node:sqlite";
import type { PriceUnit } from "./categories";

/**
 * Fictional listings so the app has something to show in development.
 * Every row is flagged is_sample = 1 and labelled "Sample listing" in the UI.
 * Delete them with: DELETE FROM businesses WHERE is_sample = 1;
 */
type SampleBusiness = {
  name: string;
  category: string;
  metro: string;
  city: string;
  state: string;
  price: number;
  unit: PriceUnit;
  description: string;
  capacity?: number;
  languages: string;
};

const SAMPLES: SampleBusiness[] = [
  // Dallas–Fort Worth
  { name: "Saffron Grand Ballroom", category: "venues", metro: "dfw", city: "Irving", state: "TX", price: 8500, unit: "event", capacity: 600, languages: "English, Hindi, Telugu", description: "Pillar-free ballroom with in-house AV, bridal suite and space for a baraat entry. Outside Indian catering allowed." },
  { name: "Lakeside Garden Estate", category: "venues", metro: "dfw", city: "Frisco", state: "TX", price: 5200, unit: "event", capacity: 250, languages: "English", description: "Outdoor lawn with lake views for haldi, mehndi and small weddings. Fire permits for havan available." },
  { name: "Mandap Hall Plano", category: "venues", metro: "dfw", city: "Plano", state: "TX", price: 1800, unit: "event", capacity: 150, languages: "English, Hindi, Gujarati", description: "Affordable community hall for pujas, birthdays and engagement ceremonies. Kitchen access included." },
  { name: "Royal Orchid Banquets", category: "venues", metro: "dfw", city: "Richardson", state: "TX", price: 3500, unit: "event", capacity: 350, languages: "English, Hindi, Tamil", description: "Mid-size banquet hall with dance floor, stage and free parking for 200 cars." },
  { name: "Annapurna Catering Co.", category: "caterers", metro: "dfw", city: "Irving", state: "TX", price: 28, unit: "person", languages: "English, Telugu, Hindi", description: "Andhra and Hyderabadi menus — biryani, live dosa counter and chaat stations. Minimum 75 guests." },
  { name: "Gujarat Rasoi Events", category: "caterers", metro: "dfw", city: "Plano", state: "TX", price: 22, unit: "person", languages: "English, Gujarati, Hindi", description: "Pure vegetarian Gujarati and Rajasthani thali. Jain options available." },
  { name: "Tandoor Trails Catering", category: "caterers", metro: "dfw", city: "Arlington", state: "TX", price: 32, unit: "person", languages: "English, Punjabi, Hindi", description: "Punjabi and Mughlai menus with live tandoor and Indo-Chinese counters." },
  { name: "Marigold Mandap Decor", category: "decorators", metro: "dfw", city: "Coppell", state: "TX", price: 4500, unit: "event", languages: "English, Hindi", description: "Full wedding decor — mandap, stage backdrop, aisle, centerpieces and fresh flower garlands." },
  { name: "Rangoli Lights & Decor", category: "decorators", metro: "dfw", city: "Frisco", state: "TX", price: 1200, unit: "event", languages: "English, Telugu", description: "Haldi, mehndi and birthday decor packages with uplighting and floral swings." },
  { name: "Shaken Not Stirred Bartending", category: "bartenders", metro: "dfw", city: "Dallas", state: "TX", price: 45, unit: "hour", languages: "English", description: "TABC-certified bartenders, mocktail menus and portable bar setups." },
  { name: "Desi Pour Co.", category: "bartenders", metro: "dfw", city: "Plano", state: "TX", price: 55, unit: "hour", languages: "English, Hindi", description: "Signature cocktails for sangeet nights — mango lassi martinis, masala chai old-fashioneds." },
  { name: "Kahani Studios", category: "photographers", metro: "dfw", city: "Dallas", state: "TX", price: 250, unit: "hour", languages: "English, Hindi, Marathi", description: "Candid wedding photography and cinematic films. Drone coverage included for full-day bookings." },
  { name: "Shubh Clicks Photography", category: "photographers", metro: "dfw", city: "Irving", state: "TX", price: 150, unit: "hour", languages: "English, Telugu, Tamil", description: "Traditional South Indian wedding coverage, half-saree and cradle ceremonies." },
  { name: "DJ Dhamaka", category: "djs", metro: "dfw", city: "Arlington", state: "TX", price: 200, unit: "hour", languages: "English, Hindi, Punjabi", description: "Bollywood, Punjabi and Tollywood mixes with LED dance floor and cold sparklers." },
  { name: "Dhol Beats DFW", category: "djs", metro: "dfw", city: "Fort Worth", state: "TX", price: 300, unit: "event", languages: "English, Punjabi", description: "Live dhol players for baraat and sangeet entries." },
  { name: "Utsav Rentals", category: "rentals", metro: "dfw", city: "Garland", state: "TX", price: 900, unit: "event", languages: "English, Hindi", description: "Mandap structures, chairs, linens, chafing dishes and baraat horse rental." },
  { name: "Sweet Mitthu Bakery", category: "bakers", metro: "dfw", city: "Irving", state: "TX", price: 120, unit: "item", languages: "English, Hindi", description: "Eggless custom cakes, rasmalai cake and mithai boxes for return gifts." },
  { name: "Glam by Priya", category: "makeup", metro: "dfw", city: "Plano", state: "TX", price: 150, unit: "hour", languages: "English, Hindi, Telugu", description: "HD and airbrush bridal makeup, hairstyling and saree/lehenga draping." },
  { name: "Bridal Glow Studio", category: "makeup", metro: "dfw", city: "Frisco", state: "TX", price: 120, unit: "hour", languages: "English, Tamil", description: "Bridal and party makeup with on-site touch-ups." },
  { name: "Henna by Heena", category: "mehndi", metro: "dfw", city: "Richardson", state: "TX", price: 80, unit: "hour", languages: "English, Hindi, Urdu", description: "Intricate bridal mehndi with organic henna. Guest mehndi stations for large events." },
  { name: "Mehndi Moments", category: "mehndi", metro: "dfw", city: "Irving", state: "TX", price: 60, unit: "hour", languages: "English, Gujarati", description: "Arabic, Rajasthani and minimal designs for brides and guests." },
  { name: "Helping Hands Event Crew", category: "helpers", metro: "dfw", city: "Dallas", state: "TX", price: 25, unit: "hour", languages: "English, Hindi, Telugu", description: "Servers, setup and cleanup crew. Experienced with buffet service at Indian events." },
  { name: "Pandit Services DFW", category: "others", metro: "dfw", city: "Irving", state: "TX", price: 351, unit: "event", languages: "Hindi, Sanskrit, Telugu", description: "Vedic weddings, griha pravesh, satyanarayan puja and naming ceremonies." },
  { name: "Naach Sangeet Choreography", category: "others", metro: "dfw", city: "Plano", state: "TX", price: 75, unit: "hour", languages: "English, Hindi", description: "Sangeet choreography for couples and families — practice sessions at your home." },

  // A few outside DFW to show other metros
  { name: "Spice Route Catering", category: "caterers", metro: "houston", city: "Sugar Land", state: "TX", price: 26, unit: "person", languages: "English, Hindi, Malayalam", description: "Kerala sadya and North Indian buffets." },
  { name: "Grand Mahal Banquet", category: "venues", metro: "toronto", city: "Brampton", state: "ON", price: 9000, unit: "event", capacity: 800, languages: "English, Punjabi, Hindi", description: "Large banquet hall popular for Punjabi weddings and receptions." },
  { name: "GTA Mehndi Art", category: "mehndi", metro: "toronto", city: "Mississauga", state: "ON", price: 70, unit: "hour", languages: "English, Punjabi, Urdu", description: "Bridal and party mehndi across the GTA." },
];

const SAMPLE_REVIEWS: [reviewer: string, rating: number, eventType: string, comment: string][] = [
  ["Anjali R.", 5, "Wedding", "Absolutely loved working with them. Everything was on time and our guests kept complimenting it!"],
  ["Rahul & Sneha", 4, "Sangeet", "Great service and fair price. Communication could have been a bit faster, but the result was amazing."],
  ["Venkat K.", 5, "Birthday", "Booked them for my son's first birthday — very professional and flexible with last-minute changes."],
  ["Meera P.", 3, "Puja / Religious", "Decent overall. They arrived late but made up for it."],
  ["Imran S.", 5, "Reception", "Top notch. Would hire again without thinking twice."],
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function seedSampleData(db: DatabaseSync) {
  const insertBusiness = db.prepare(`
    INSERT INTO businesses
      (slug, name, category, description, metro, city, state, phone, price, price_unit, capacity, languages, is_sample)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);
  const insertReview = db.prepare(
    "INSERT INTO reviews (business_id, reviewer_name, rating, event_type, comment, created_at) VALUES (?, ?, ?, ?, ?, datetime('now', ?))",
  );

  db.exec("BEGIN");
  SAMPLES.forEach((s, i) => {
    const { lastInsertRowid } = insertBusiness.run(
      `${slugify(s.name)}-${slugify(s.city)}`,
      s.name,
      s.category,
      s.description,
      s.metro,
      s.city,
      s.state,
      `(555) 01${String(i).padStart(2, "0")}-0000`,
      s.price,
      s.unit,
      s.capacity ?? null,
      s.languages,
    );
    // Deterministic 0–4 reviews per business.
    const reviewCount = i % 5;
    for (let r = 0; r < reviewCount; r++) {
      const [name, rating, eventType, comment] = SAMPLE_REVIEWS[(i + r) % SAMPLE_REVIEWS.length];
      insertReview.run(lastInsertRowid, name, rating, eventType, comment, `-${(i + 1) * (r + 3)} days`);
    }
  });
  db.exec("COMMIT");
}
