# Cashout Data Model

This document specifies the canonical data model for the Cashout application (a digital wallet for bottle deposit coupons).

## Coupon Entity

The primary entity in the system is the **Coupon**. Below is the detailed schema specification:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT (UUID v4) | PRIMARY KEY, NOT NULL | Unique identifier, UUID for sync compatibility |
| `barcode_value` | TEXT | NOT NULL | Raw barcode string as printed on the coupon |
| `barcode_format` | TEXT | NOT NULL, DEFAULT 'CODE128' | Barcode symbology: EAN13, CODE128, QR, etc. |
| `amount_cents` | INTEGER | NOT NULL | Coupon value in euro cents (e.g., 125 = €1.25) |
| `currency` | TEXT | NOT NULL, DEFAULT 'EUR' | ISO 4217 currency code |
| `store_name` | TEXT | NULL | Name of the issuing store |
| `store_address` | TEXT | NULL | Address of the issuing store |
| `store_latitude` | REAL | NULL | GPS latitude of the store (Phase 3) |
| `store_longitude` | REAL | NULL | GPS longitude of the store (Phase 3) |
| `status` | TEXT | NOT NULL, DEFAULT 'active' | Enum: 'active', 'redeemed', 'expired' |
| `issued_at` | TEXT | NULL | ISO 8601 UTC, date printed on the coupon |
| `expires_at` | TEXT | NULL | ISO 8601 UTC, expiry date from the coupon |
| `redeemed_at` | TEXT | NULL | ISO 8601 UTC, when the user redeemed it |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | ISO 8601 UTC, when the record was created in the app |
| `updated_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | ISO 8601 UTC, last modification time |
| `synced_at` | TEXT | NULL | ISO 8601 UTC, last cloud sync time (Phase 2) |
| `notes` | TEXT | NULL | Free-text user notes |

## Design Decisions

- **`amount_cents` as INTEGER**: Using euro cents as an integer avoids floating-point rounding errors and precision issues during calculation.
- **`currency` Field**: Future-proofs the application for non-EUR deposit systems or international expansions.
- **Nullable Location Coordinates**: `store_latitude` and `store_longitude` are nullable, intended to be populated when GPS capture features are built in Phase 3.
- **Nullable `synced_at`**: `synced_at` is `NULL` for locally created items that haven't been synchronized to the backend yet (Phase 2 cloud sync).
- **UUID Primary Keys**: Using UUID v4 strings for primary keys allows client-side generation without ID collisions during offline-first usage and server sync.
- **Supabase/PostgreSQL Alignment**: The schema is designed 1:1 to map to a remote PostgreSQL table (e.g., in Supabase) in future backend integration.

## CouponStatus Enum

The `status` field represents the lifecycle state of a coupon:

- `active` — Coupon is available and ready for redemption.
- `redeemed` — Coupon has been successfully redeemed at a store checkout.
- `expired` — Coupon has passed its expiry date (can be set automatically by the app upon checking `expires_at` or set manually by the user).

## Indexes

To optimize query performance for common access patterns, the following indexes are defined:

- `idx_coupon_status`: Built on `status` — optimizes filtering active, redeemed, or expired coupons.
- `idx_coupon_expires_at`: Built on `expires_at` — optimizes sorting coupons by soonest expiry date.
- `idx_coupon_store_name`: Built on `store_name` — optimizes grouping and filtering coupons by issuing store.

## SQLite CREATE TABLE Statement

Below is the complete SQL DDL statement for creating the `coupons` table and its associated indexes in SQLite:

```sql
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY NOT NULL,
    barcode_value TEXT NOT NULL,
    barcode_format TEXT NOT NULL DEFAULT 'CODE128',
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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    synced_at TEXT,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_coupon_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupon_expires_at ON coupons(expires_at);
CREATE INDEX IF NOT EXISTS idx_coupon_store_name ON coupons(store_name);
```

## Future: Store Entity (Phase 3+)

In Phase 3+, as location-based features (like geolocation reminders and store maps) are introduced, store data may be normalized into a dedicated `stores` entity (e.g., `id`, `name`, `address`, `latitude`, `longitude`). For the MVP, store information is intentionally denormalized into the `coupons` table to maintain zero-join query simplicity for offline device storage.
