# Cashout — Phased Feature Roadmap

This document outlines the phased feature development roadmap for the **Cashout** digital coupon wallet app.

---

## Phase 1 — MVP: Local Coupon Wallet

**Goal**: Deliver a solid core scan-store-redeem loop working entirely offline on Android.

### Features
- **Barcode Scanning**: Scan barcodes from physical paper return coupons using the device camera (`expo-camera`).
- **Manual Entry Fallback**: Allow manual typing of barcode digits if camera scanning fails or the paper receipt is worn out.
- **Coupon Metadata Storage**: Store raw barcode value, refund amount (in EUR), store name, store address, and expiry date.
- **Main Wallet View**: Display all active coupons on the primary dashboard, automatically sorted by expiry date (soonest expiring first).
- **Redemption View**: Dedicated coupon detail view featuring a bright, full-screen barcode display ready for cashier scanning.
- **Status & Lifecycle**: Ability to mark coupons as redeemed or delete them from the wallet.
- **Offline Data Persistence**: Embedded SQLite database (`expo-sqlite`) ensuring full offline functionality.
- **Material Design 3 UI**: Clean user interface built with React Native Paper, supporting dark and light themes seamlessly.

### Architectural Notes (Phase 1 Groundwork)
- **Database Compatibility**: Design the SQLite local data model to closely match the planned cloud database (PostgreSQL/Supabase).
- **Barcode Separation**: Store the raw barcode string (`barcodeValue`) separately from the symbology/format field (`barcodeFormat`, e.g., `ean13`, `code128`).
- **Standardized Timestamps**: Save all datetime values as ISO 8601 UTC strings (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`).

---

## Phase 2 — Cloud Sync

**Goal**: Synchronize coupons with the cloud for automated backup and seamless multi-device usage.

### Planned Features
- **Backend Integration**: Supabase (PostgreSQL) instance for cloud database storage.
- **Offline-First Sync Engine**: Local-first operation with background synchronization whenever connectivity becomes available.
- **Account Options**: Optional user authentication (anonymous guest mode with optional account registration/login).

### Architectural Implications for Phase 1
- **Primary Keys**: Use **UUIDs** (version 4) for primary keys instead of auto-incrementing integers to ensure conflict-free sync across devices.
- **Sync Metadata**: Include `createdAt`, `updatedAt`, and `syncedAt` timestamps on all database records from Day 1.

---

## Phase 3 — Location-Based Reminders

**Goal**: Automatically remind users to redeem their coupons when entering or visiting an issuing store.

### Planned Features
- **GPS Capture**: Capture location coordinates (latitude/longitude) during coupon creation or store selection.
- **Geofencing**: Background geofence monitoring to detect when a user enters a store's proximity radius.
- **Dwell Time Logic**: Configurable threshold (e.g., user must remain inside the geofence for 5+ minutes) to prevent accidental notifications when just walking past.
- **Push Notifications**: Timely local push notifications via `expo-notifications`.

### Architectural Implications for Phase 1
- **Location Fields**: Include optional `latitude` and `longitude` fields in the coupon data model.
- **Store Normalization**: Structure data models so stores can eventually be normalized into a distinct entity (enabling multiple coupons to link to a single physical store location).

---

## Phase 4 — Map View

**Goal**: Provide a geographical overview of all available deposit coupons.

### Planned Features
- **Interactive Map**: Display interactive map interface featuring pin markers and cluster markers for nearby stores with active coupons.
- **Store Popup**: Tap any marker to view a sheet listing all active coupons at that specific store location.
- **Filtering**: Easily filter map pins by active, redeemed, or expired status.

---

## Phase 5 — Shareable Coupon Links

**Goal**: Enable instant sharing of a coupon via web link or messaging app.

### Planned Features
- **Web Endpoint**: Web app page (companion site or Expo web export) that directly renders a redeemable barcode from query parameters.
  - *Example*: `https://cashout.app/redeem?barcode=4012345678901&format=ean13`
- **Zero-Auth Access**: The URL itself contains the necessary payload—no login required for the recipient to display and redeem the barcode.
- **App Deep Linking**: Seamlessly deep-link back into the native Cashout mobile app if installed on the recipient's device.

### Architectural Implications for Phase 1
- **Deep Link Scheme**: Ensure the Expo Router deep link scheme (`cashout://`) is properly configured in `app.json`.
- **Symbology Tracking**: Explicitly store and preserve the barcode format (`format`) alongside the string value to faithfully recreate identical barcodes on web/mobile platforms.
