# Cashout — High-Level Project Overview

## App Identity

- **Name**: Cashout
- **Purpose**: Digital wallet for bottle deposit coupons (Pfand / pant system common in Europe)
- **Target Platform**: Android (primary), with potential for iOS expansion later
- **Repository**: `cashout`

---

## Problem Statement

In many European countries (such as Germany, the Netherlands, and Scandinavia), a bottle deposit (_Pfand_ / _pant_) system is widely established. When consumers return empty bottles, cans, and crates to collection machines in grocery stores and supermarkets, the machine prints a paper receipt/coupon containing a barcode and monetary deposit refund amount.

This paper coupon is intended to be redeemed at the store's checkout counter to offset the total purchase price. However, several pain points exist with the current physical paper workflow:

1. **Loss and Damage**: Paper coupons are easily lost, crushed, washed in laundry, or damaged beyond readability.
2. **Multi-Store Confusion**: Users accumulate coupons from different grocery chains and locations, each having different validity and expiration periods.
3. **Lack of Total Visibility**: Users have no quick overview of the total monetary deposit value sitting unused in their wallet or pockets.
4. **Expiration**: It is easy to forget to use a coupon before it expires or before leaving a specific store region.

---

## Solution

**Cashout** digitizes the entire coupon storage workflow:

1. **Scan & Save**: Users scan the barcode from the printed paper coupon using their device's camera, enter the monetary refund amount and store details (or let auto-detection fill it), and save it.
2. **Organize & Track**: The app aggregates all stored coupons into a clean digital wallet, sorted by proximity, store, or upcoming expiration date.
3. **Redeem Seamlessly**: When returning to the store, the user opens the coupon detail view to display a crisp, bright, full-screen barcode directly on their smartphone display for the cashier to scan—just like the paper original.

---

## Tech Stack Summary

| Layer                | Technology / Library                | Details & Notes                                                        |
| :------------------- | :---------------------------------- | :--------------------------------------------------------------------- |
| **Runtime / Core**   | **Expo SDK 57** (React Native 0.86) | Modern Expo ecosystem targeting Android & iOS                          |
| **Language**         | **TypeScript**                      | Strict mode enabled across the codebase                                |
| **UI Framework**     | **Expo UI**                         | Native Jetpack Compose components on Android                           |
| **Navigation**       | **Expo Router**                     | File-based, typed routing system                                       |
| **Local Storage**    | **`expo-sqlite`**                   | Local SQLite database for offline persistence (MVP)                    |
| **Barcode Scanning** | **`expo-camera`**                   | Fast and accurate camera scanning for paper coupons                    |
| **State Management** | **React Context + Hooks**           | Lightweight state for MVP; migration to Zustand evaluated for Phase 2+ |
