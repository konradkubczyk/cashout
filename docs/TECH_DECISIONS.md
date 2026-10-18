# Architecture Decision Records

## ADR-001: SQLite over AsyncStorage for Local Persistence

**Status**: Accepted  
**Date**: 2025-07-27  
**Context**:

- The app needs to store structured coupon data locally
- Options considered: AsyncStorage (key-value), MMKV (key-value), SQLite (relational), WatermelonDB (reactive SQLite ORM)
- Data is inherently relational (coupons with typed fields, status enum, dates)
- Future plan: sync to PostgreSQL via Supabase (Phase 2)

**Decision**: Use expo-sqlite for local storage

**Consequences**:

- (+) SQL schema maps directly to PostgreSQL for future cloud sync
- (+) Efficient querying: filter by status, sort by expiry, search by store
- (+) expo-sqlite is a built-in Expo module — no native linking or config plugins needed
- (+) Supports migrations via versioned schema
- (-) More setup than AsyncStorage — need schema definition, repository layer
- (-) No reactive queries out of the box (unlike WatermelonDB) — need manual invalidation

## ADR-002: Expo UI as the Android UI Library

**Status**: Accepted  
**Date**: 2026-07-30

**Context**:

- Need native Android components for an Android-focused Material Design UI
- Options considered: Expo UI, React Native Paper, NativeBase, Tamagui, Gluestack, raw React Native components
- App targets Android primarily, where Jetpack Compose is the native UI toolkit

**Decision**: Use Expo UI universal components, which render as Jetpack Compose on Android. Use the Android-specific Expo UI layer only when the universal component API does not meet a requirement.

**Consequences**:

- (+) Uses real native Jetpack Compose components on Android
- (+) Host can derive a Material 3 palette from a seed color
- (+) Universal components keep the option of supporting other platforms later without requiring it today
- (+) Android-specific Compose primitives are available when a universal component is insufficient
- (-) Opinionated styling — custom designs require theme overrides
- (-) Every Expo UI tree requires a Host wrapper
- (-) The Android-specific Compose layer must remain isolated from iOS code if iOS support is added

## ADR-003: expo-camera for Barcode Scanning

**Status**: Accepted  
**Date**: 2025-07-27  
**Context**:

- App needs to scan barcodes from paper deposit coupons
- Common barcode formats: EAN-13, Code128, Code39, QR
- Options considered: expo-camera (built-in barcode scanning), react-native-vision-camera, expo-barcode-scanner (deprecated)

**Decision**: Use expo-camera with its built-in barcode scanning capabilities

**Consequences**:

- (+) First-party Expo module — zero config, managed workflow compatible
- (+) Supports all common barcode formats (EAN-13, Code128, QR, etc.)
- (+) No additional native dependencies
- (-) Less customizable than react-native-vision-camera
- (-) Performance may be slightly lower for rapid scanning scenarios (acceptable for single-coupon use case)

## ADR-004: Expo Router for Navigation

**Status**: Accepted  
**Date**: 2025-07-27  
**Context**:

- Need navigation library for screen management
- Options: Expo Router (file-based), React Navigation (imperative), React Native Navigation (native)
- Future plan: deep links for shareable coupon URLs (Phase 5)

**Decision**: Use Expo Router (file-based routing, already set up in the project)

**Consequences**:

- (+) File-based routing reduces boilerplate
- (+) Built-in deep link support via scheme configuration (cashout://)
- (+) Typed routes enabled (experiments.typedRoutes in app.json)
- (+) Native Stack navigator for performant navigation
- (+) Already configured in the project
- (-) Less flexible than imperative React Navigation for complex navigation patterns
- (-) Route file structure must match URL structure

## ADR-005: Android-First Target Platform

**Status**: Accepted  
**Date**: 2025-07-27  
**Context**:

- Bottle deposit (Pfand) systems are most common in Germany, Netherlands, Scandinavia
- In these markets, Android holds 60-75% market share
- Resource constraints favor focusing on one platform initially
- Expo enables cross-platform from the same codebase when iOS support is added

**Decision**: Target Android as the primary platform for MVP

**Consequences**:

- (+) Focus development and testing effort on the dominant platform
- (+) Material Design 3 through Jetpack Compose is the native Android design language
- (+) Can add iOS support later with minimal code changes (Expo is cross-platform)
- (-) iOS users excluded from MVP
- (-) May need to adjust some UI patterns when adding iOS support (e.g., platform-specific navigation patterns)

## ADR-006: Monetary Values as Integer Cents

**Status**: Accepted  
**Date**: 2025-07-27  
**Context**:

- Coupon amounts need to be stored and displayed accurately
- Floating-point arithmetic has precision issues (0.1 + 0.2 ≠ 0.3)
- Options: float, decimal string, integer cents

**Decision**: Store amounts as integer cents (e.g., €1.25 → 125)

**Consequences**:

- (+) No floating-point precision issues
- (+) Simple integer arithmetic for totals
- (+) Standard practice in financial software
- (+) Maps cleanly to PostgreSQL INTEGER column
- (-) Need to format for display (divide by 100)
- (-) Must be clear in API and variable naming that values are in cents
