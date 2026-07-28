# Cashout — Agent Instructions

## Quick Summary

Cashout is a **digital wallet for bottle deposit coupons** (Pfand/pant). Users scan barcodes from paper coupons issued by bottle return machines, store them in the app, and later present the barcode on-screen at the store checkout for redemption.

**Target platform**: Android (primary)

## Expo Version

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Tech Stack

| Layer            | Technology         | Version                       |
| ---------------- | ------------------ | ----------------------------- |
| Runtime          | Expo SDK           | 57                            |
| Framework        | React Native       | 0.86                          |
| Language         | TypeScript         | strict mode                   |
| UI Library       | React Native Paper | 5.x (Material Design 3)       |
| Navigation       | Expo Router        | 57 (file-based, typed routes) |
| Local Storage    | expo-sqlite        | (planned)                     |
| Barcode Scanning | expo-camera        | (planned)                     |

## Project Documentation

All structured project documentation lives in `docs/`. Read these files to understand the project before making changes:

| File                     | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `docs/OVERVIEW.md`       | High-level project overview, problem statement, solution           |
| `docs/ARCHITECTURE.md`   | Folder structure, navigation, data layer, UI architecture          |
| `docs/DATA_MODEL.md`     | Canonical data model, Coupon table schema, SQL DDL                 |
| `docs/USER_JOURNEYS.md`  | Detailed user journey specifications for MVP features              |
| `docs/ROADMAP.md`        | Phased feature roadmap (Phase 1–5) with architectural implications |
| `docs/TECH_DECISIONS.md` | Architecture Decision Records (ADRs)                               |

## Key Conventions

- **Folder structure**: `src/app/` for Expo Router routes only; `src/screens/` for screen bodies; `src/components/` for reusable UI; `src/db/` for database layer; `src/hooks/` for custom hooks; `src/utils/` for utilities.
- **File naming**: kebab-case (`coupon-card.tsx`).
- **Route files are thin**: they delegate rendering to screen components in `src/screens/`.
- **One named export per component file**.
- **Styles**: colocated via `StyleSheet.create()` at the bottom of the component file.
- **Tests**: colocated next to source files (`*.test.ts` or `*.test.tsx`). You MUST write basic unit tests for any new features, screens, or components you create. Use `@testing-library/react-native` for components and screen tests.
- **Dates**: ISO 8601 UTC strings everywhere.
- **IDs**: UUID v4 (for future cloud sync compatibility).
- **Money**: integer cents (`amount_cents`), never floats.
- **Path alias**: `@/*` → `./src/*` (configured in tsconfig.json).

## Current State

The project is freshly scaffolded from `create-expo-app`. The `src/app/` directory has a minimal root layout and index route. React Native Paper is installed but not yet integrated into the layout. No application features have been implemented yet.

## What NOT To Do

- Do **not** restructure the existing folder layout — follow the conventions documented above.
- Do **not** use AsyncStorage for structured data — use SQLite (see ADR-001 in `docs/TECH_DECISIONS.md`).
- Do **not** use floating-point for monetary values — use integer cents (see ADR-006).
- Do **not** target iOS-specific UI patterns — Android is the primary platform (see ADR-005).
