import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { seedSampleData } from "./seed";

// DATA_DIR points at a persistent volume in production (e.g. /data on Railway).
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS businesses (
  id          INTEGER PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  metro       TEXT NOT NULL,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  zip         TEXT,
  phone       TEXT,
  email       TEXT,
  website     TEXT,
  instagram   TEXT,
  price       INTEGER NOT NULL,          -- whole dollars, in the metro's currency
  price_unit  TEXT NOT NULL DEFAULT 'hour',
  capacity    INTEGER,                   -- venues only: max guests
  languages   TEXT NOT NULL DEFAULT '',  -- comma separated
  is_sample   INTEGER NOT NULL DEFAULT 0,
  manage_token TEXT UNIQUE,              -- secret for the owner's private manage link
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_businesses_search ON businesses (metro, category);

CREATE TABLE IF NOT EXISTS reviews (
  id            INTEGER PRIMARY KEY,
  business_id   INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  event_type    TEXT,
  comment       TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews (business_id);

CREATE TABLE IF NOT EXISTS business_photos (
  id          INTEGER PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_business_photos_business ON business_photos (business_id);

CREATE TABLE IF NOT EXISTS review_photos (
  id        INTEGER PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL
);
`;

function open() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "app.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  migrate(db);
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM businesses").get() as { n: number };
  if (n === 0) seedSampleData(db);
  return db;
}

// Bring databases created before a column existed up to date.
function migrate(db: DatabaseSync) {
  const columns = db.prepare("PRAGMA table_info(businesses)").all() as { name: string }[];
  if (!columns.some((c) => c.name === "manage_token")) {
    db.exec("ALTER TABLE businesses ADD COLUMN manage_token TEXT");
    db.exec("CREATE UNIQUE INDEX idx_businesses_manage_token ON businesses (manage_token)");
  }
}

// Reuse one connection across hot reloads in dev.
const globalForDb = globalThis as unknown as { db?: DatabaseSync };
export const db = (globalForDb.db ??= open());

export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
