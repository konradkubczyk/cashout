import type { SQLiteDatabase } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import type { Coupon, CreateCouponDto, UpdateCouponDto } from "./schema";
import { DEFAULT_BARCODE_FORMAT, DEFAULT_CURRENCY } from "@/constants";
import { nowISO } from "@/utils/date";

/**
 * Retrieves all active coupons, sorted by expiry date (soonest first).
 * Coupons without an expiry date are sorted to the end.
 */
export async function getAllCoupons(db: SQLiteDatabase): Promise<Coupon[]> {
  return db.getAllAsync<Coupon>(
    `SELECT * FROM coupons
     WHERE status = 'active'
     ORDER BY
       CASE WHEN expires_at IS NULL THEN 1 ELSE 0 END,
       expires_at ASC,
       created_at DESC`,
  );
}

/**
 * Retrieves archived (redeemed or expired) coupons, most recently updated first.
 */
export async function getArchivedCoupons(
  db: SQLiteDatabase,
): Promise<Coupon[]> {
  return db.getAllAsync<Coupon>(
    `SELECT * FROM coupons
     WHERE status IN ('redeemed', 'expired')
     ORDER BY updated_at DESC`,
  );
}

/**
 * Retrieves a single coupon by its UUID.
 * Returns null if not found.
 */
export async function getCouponById(
  db: SQLiteDatabase,
  id: string,
): Promise<Coupon | null> {
  return db.getFirstAsync<Coupon>("SELECT * FROM coupons WHERE id = ?", [id]);
}

/**
 * Inserts a new coupon and returns the created record.
 * Generates a UUID v4 for the id and sets timestamps.
 */
export async function insertCoupon(
  db: SQLiteDatabase,
  dto: CreateCouponDto,
): Promise<Coupon> {
  const id = Crypto.randomUUID();
  const now = nowISO();
  const barcodeFormat = dto.barcode_format ?? DEFAULT_BARCODE_FORMAT;
  const currency = dto.currency ?? DEFAULT_CURRENCY;

  await db.runAsync(
    `INSERT INTO coupons (id, barcode_value, barcode_format, amount_cents, currency, store_name, store_address, expires_at, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      dto.barcode_value,
      barcodeFormat,
      dto.amount_cents,
      currency,
      dto.store_name ?? null,
      dto.store_address ?? null,
      dto.expires_at ?? null,
      dto.notes ?? null,
      now,
      now,
    ],
  );

  const coupon = await getCouponById(db, id);
  if (!coupon) {
    throw new Error("Failed to retrieve inserted coupon");
  }
  return coupon;
}

/**
 * Updates an existing coupon with the provided fields.
 * Only non-undefined fields in the DTO are updated.
 */
export async function updateCoupon(
  db: SQLiteDatabase,
  id: string,
  dto: UpdateCouponDto,
): Promise<Coupon> {
  const setClauses: string[] = [];
  const values: (string | number | null)[] = [];

  const fields: {
    key: keyof UpdateCouponDto;
    column: string;
  }[] = [
    { key: "barcode_value", column: "barcode_value" },
    { key: "barcode_format", column: "barcode_format" },
    { key: "amount_cents", column: "amount_cents" },
    { key: "currency", column: "currency" },
    { key: "store_name", column: "store_name" },
    { key: "store_address", column: "store_address" },
    { key: "status", column: "status" },
    { key: "expires_at", column: "expires_at" },
    { key: "redeemed_at", column: "redeemed_at" },
    { key: "notes", column: "notes" },
  ];

  for (const { key, column } of fields) {
    if (dto[key] !== undefined) {
      setClauses.push(`${column} = ?`);
      values.push(dto[key] as string | number | null);
    }
  }

  if (setClauses.length === 0) {
    const coupon = await getCouponById(db, id);
    if (!coupon) throw new Error(`Coupon ${id} not found`);
    return coupon;
  }

  // Always update updated_at
  setClauses.push("updated_at = ?");
  values.push(nowISO());

  // Add id for WHERE clause
  values.push(id);

  await db.runAsync(
    `UPDATE coupons SET ${setClauses.join(", ")} WHERE id = ?`,
    values,
  );

  const coupon = await getCouponById(db, id);
  if (!coupon) throw new Error(`Coupon ${id} not found after update`);
  return coupon;
}

/**
 * Marks a coupon as redeemed and sets the redeemed_at timestamp.
 */
export async function redeemCoupon(
  db: SQLiteDatabase,
  id: string,
): Promise<Coupon> {
  return updateCoupon(db, id, {
    status: "redeemed",
    redeemed_at: nowISO(),
  });
}

/**
 * Permanently deletes a coupon from the database.
 */
export async function deleteCoupon(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  await db.runAsync("DELETE FROM coupons WHERE id = ?", [id]);
}
