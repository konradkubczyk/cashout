# Cashout User Journeys (MVP)

This document outlines the core user journeys for the initial MVP release of the Cashout application.

---

## Journey 1: Scan & Store a Coupon

**Trigger**: User has just returned bottles at a store reverse vending machine and received a printed paper deposit coupon.

**Preconditions**:
- App is installed on user's Android device.
- Device has a working camera.

**Steps**:
1. User opens the Cashout app.
2. User taps the "Scan" button / Floating Action Button (FAB) on the home screen.
3. App opens the camera view equipped with a barcode scanning overlay.
4. User points the camera at the coupon's barcode.
5. App detects and reads the barcode value and symbology format.
6. App navigates to the "Add Coupon" form, pre-filling the barcode value.
7. User enters metadata:
   - **Amount** (required)
   - **Store Name** (optional)
   - **Store Address** (optional)
   - **Expiry Date** (optional)
8. User taps "Save".
9. App persists the coupon record into the local SQLite database.
10. App navigates back to the home screen, displaying the newly created coupon in the list.

**Postconditions**:
- Coupon is persisted in the local SQLite database with status `'active'`.
- Coupon appears on the home screen list, sorted by expiry date.

**Edge Cases**:
- **Camera permission denied**: Show an explanation modal with a direct link to open OS system settings.
- **Barcode not readable**: Offer a quick fallback button to switch to manual entry mode.
- **Duplicate barcode**: Display a subtle warning to the user, but allow saving (some store reverse vending machines reuse barcode series).

---

## Journey 2: Manual Coupon Entry

**Trigger**: User has a bottle deposit coupon, but the printed barcode is worn, stained, torn, or the camera is unable to capture it cleanly.

**Preconditions**:
- App is installed on user's device.

**Steps**:
1. User opens the Cashout app.
2. User taps the "Add manually" option on the home screen or within the scan screen.
3. User types the numerical or alphanumeric barcode string printed under the barcode image.
4. User selects the barcode format (default: `Code128`).
5. User enters metadata (amount [required], store name [optional], store address [optional], expiry date [optional]).
6. User taps "Save".
7. App stores the coupon in the SQLite database and returns to the home screen.

**Postconditions**:
- Same as Journey 1: Coupon is saved with status `'active'` and appears in the list.

---

## Journey 3: Browse & Manage Coupons

**Trigger**: User wants to view their wallet balance, check expiring coupons, or review past redemptions.

**Steps**:
1. User opens the app (lands directly on the home screen).
2. Home screen presents a list of all stored coupons, sorted by expiry date (soonest expiring coupons at the top).
3. Each coupon card displays key metadata:
   - Store name
   - Value amount (formatted currency)
   - Expiry date
   - Status badge (`active`, `redeemed`, `expired`)
4. User can tap any coupon card to open its detail view.
5. From the detail screen, the user can perform actions:
   - Mark as redeemed
   - Delete coupon
   - Navigate back to the main list

**Edge Cases**:
- **No coupons stored**: Display a friendly empty state illustration with a clear Call To Action (CTA) button to scan a new coupon.
- **Expired coupons**: Displayed with clear visual distinction (e.g., dimmed opacity, strikethrough text, or explicit "Expired" badge).

---

## Journey 4: Redeem a Coupon

**Trigger**: User is at the store checkout register and wants to apply a stored deposit coupon towards their purchase.

**Preconditions**:
- User has at least one active coupon saved for this store.

**Steps**:
1. User opens the Cashout app.
2. User locates the coupon for the relevant store in the list.
3. User taps the coupon card to open the detail view.
4. User taps "Show Barcode" (or the barcode is displayed prominently on screen).
5. App renders the generated high-resolution barcode in full-screen view (maximizing device screen brightness and contrast for optimal scanner readability).
6. User presents the phone screen to the cashier or self-checkout barcode scanner.
7. After the scanner successfully reads the barcode, user taps "Mark as Redeemed".
8. Coupon status updates to `'redeemed'` and sets the current timestamp in `redeemed_at`.

**Postconditions**:
- Coupon status is set to `'redeemed'`.
- Coupon remains in the store history list, but is visually distinguished (e.g., grayed out).
- `redeemed_at` timestamp is updated in local storage.

**Edge Cases**:
- **Scanner cannot read screen**: Suggest adjusting screen brightness, distance, or angle to clear glare.
- **Partial redemption**: (Amount of coupon exceeds total checkout purchase) Currently not supported by MVP; coupon is treated as either fully redeemed or unredeemed.
