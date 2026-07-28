import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import { CouponCard } from "../../src/components/coupon-card";
import type { Coupon } from "../../src/db/schema";

const mockCoupon: Coupon = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  barcode_value: "4901234567890",
  barcode_format: "ean13",
  amount_cents: 125,
  currency: "EUR",
  store_name: "REWE",
  store_address: null,
  store_latitude: null,
  store_longitude: null,
  status: "active",
  issued_at: null,
  expires_at: "2026-12-31T23:59:59.999Z",
  redeemed_at: null,
  created_at: "2026-07-28T10:00:00.000Z",
  updated_at: "2026-07-28T10:00:00.000Z",
  synced_at: null,
  notes: null,
};

function renderWithProvider(component: React.ReactElement) {
  return render(<PaperProvider>{component}</PaperProvider>);
}

describe("CouponCard", () => {
  it("renders correctly with coupon data", async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithProvider(
      <CouponCard coupon={mockCoupon} onPress={onPress} />,
    );

    expect(getByText("REWE")).toBeTruthy();
    expect(getByText("€1.25")).toBeTruthy();
    expect(getByText("4901234567890")).toBeTruthy();
    expect(getByText("Active")).toBeTruthy();
  });

  it('shows "Unknown Store" when store_name is null', async () => {
    const onPress = jest.fn();
    const coupon = { ...mockCoupon, store_name: null };
    const { getByText } = await renderWithProvider(
      <CouponCard coupon={coupon} onPress={onPress} />,
    );

    expect(getByText("Unknown Store")).toBeTruthy();
  });

  it("shows redeemed status", async () => {
    const onPress = jest.fn();
    const coupon: Coupon = { ...mockCoupon, status: "redeemed" };
    const { getByText } = await renderWithProvider(
      <CouponCard coupon={coupon} onPress={onPress} />,
    );

    expect(getByText("Redeemed")).toBeTruthy();
  });

  it("calls onPress when tapped", async () => {
    const onPress = jest.fn();
    const { getByText } = await renderWithProvider(
      <CouponCard coupon={mockCoupon} onPress={onPress} />,
    );

    fireEvent.press(getByText("REWE"));
    expect(onPress).toHaveBeenCalledWith(mockCoupon);
  });
});
