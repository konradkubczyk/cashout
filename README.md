# Cashout 🧾

A digital wallet for bottle deposit coupons — scan, store, and redeem your Pfand receipts.

## What Is This?

In many European countries, a deposit (Pfand) system exists for bottles and cans. When you return empty containers to a collection machine at a store, the machine prints a paper coupon with a barcode. You can use this coupon at checkout to offset your purchase.

**Cashout** digitizes this workflow. Instead of keeping crumpled paper receipts in your pocket, you scan the barcode with the app. When you're back at the store, present the barcode on-screen — the cashier scans it just like the paper original.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) (React Native 0.86) |
| Language | TypeScript (strict mode) |
| UI | [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Local Storage | SQLite via expo-sqlite |
| Target | Android |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Android Studio](https://developer.android.com/studio) with an emulator, or a physical Android device with [Expo Go](https://expo.dev/go)

### Install & Run

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start

# Run on Android emulator or device
npm run android
```

## Project Structure

```
cashout/
├── assets/                  # Icons, splash screen, fonts
├── docs/                    # Project documentation
│   ├── OVERVIEW.md          # Project overview & problem statement
│   ├── ARCHITECTURE.md      # Technical architecture
│   ├── DATA_MODEL.md        # Database schema
│   ├── USER_JOURNEYS.md     # User journey specifications
│   ├── ROADMAP.md           # Feature roadmap (Phase 1–5)
│   └── TECH_DECISIONS.md    # Architecture Decision Records
├── src/
│   ├── app/                 # Expo Router routes
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screen bodies
│   ├── db/                  # Database layer
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Utility functions
├── AGENTS.md                # AI agent instructions
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Documentation

Full project documentation is in the [`docs/`](./docs/) directory. See [`AGENTS.md`](./AGENTS.md) for a quick orientation.
