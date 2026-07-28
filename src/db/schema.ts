import type { SQLiteDatabase } from "expo-sqlite";

/**
 * Coupon status enum values.
 */
export type CouponStatus = "active" | "redeemed" | "expired";

/**
 * Full Coupon entity as stored in and retrieved from the database.
 */
export interface Coupon {
  id: string;
  barcode_value: string;
  barcode_format: string;
  amount_cents: number;
  currency: string;
  store_name: string | null;
  store_address: string | null;
  store_latitude: number | null;
  store_longitude: number | null;
  status: CouponStatus;
  issued_at: string | null;
  expires_at: string | null;
  redeemed_at: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  notes: string | null;
}

/**
 * DTO for creating a new coupon.
 * Fields with defaults or auto-generated values are omitted.
 */
export interface CreateCouponDto {
  barcode_value: string;
  barcode_format?: string;
  amount_cents: number;
  currency?: string;
  store_name?: string | null;
  store_address?: string | null;
  expires_at?: string | null;
  notes?: string | null;
}

/**
 * DTO for updating an existing coupon.
 * All fields are optional — only provided fields will be updated.
 */
export interface UpdateCouponDto {
  barcode_value?: string;
  barcode_format?: string;
  amount_cents?: number;
  currency?: string;
  store_name?: string | null;
  store_address?: string | null;
  status?: CouponStatus;
  expires_at?: string | null;
  redeemed_at?: string | null;
  notes?: string | null;
}

/**
 * Current schema version. Increment when adding migrations.
 */
const CURRENT_VERSION = 1;

/**
 * Runs database migrations based on PRAGMA user_version.
 * Called from SQLiteProvider's onInit callback.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= CURRENT_VERSION) {
    return;
  }

  // Run all migrations in a single transaction
  await db.execAsync("BEGIN TRANSACTION");

  try {
    if (currentVersion < 1) {
      await applyV1Migration(db);
    }

    // Set the new version
    await db.execAsync(`PRAGMA user_version = ${CURRENT_VERSION}`);
    await db.execAsync("COMMIT");
  } catch (error) {
    await db.execAsync("ROLLBACK");
    throw error;
  }
}

/**
 * V1 Migration: Create the coupons table and indexes.
 */
async function applyV1Migration(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY NOT NULL,
      barcode_value TEXT NOT NULL,
      barcode_format TEXT NOT NULL DEFAULT 'code128',
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      store_name TEXT,
      store_address TEXT,
      store_latitude REAL,
      store_longitude REAL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
      issued_at TEXT,
      expires_at TEXT,
      redeemed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced_at TEXT,
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_coupon_status ON coupons(status);
    CREATE INDEX IF NOT EXISTS idx_coupon_expires_at ON coupons(expires_at);
    CREATE INDEX IF NOT EXISTS idx_coupon_store_name ON coupons(store_name);
  `);
}
