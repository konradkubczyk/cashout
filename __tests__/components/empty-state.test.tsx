import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import { EmptyState } from "../../src/components/empty-state";

function renderWithProvider(component: React.ReactElement) {
  return render(<PaperProvider>{component}</PaperProvider>);
}

describe("EmptyState", () => {
  it("renders message text", async () => {
    const { getByText } = await renderWithProvider(
      <EmptyState message="No coupons yet" />,
    );

    expect(getByText("No coupons yet")).toBeTruthy();
  });

  it("renders description when provided", async () => {
    const { getByText } = await renderWithProvider(
      <EmptyState
        message="No coupons yet"
        description="Scan a barcode to get started"
      />,
    );

    expect(getByText("Scan a barcode to get started")).toBeTruthy();
  });

  it("renders action button when label and onAction provided", async () => {
    const onAction = jest.fn();
    const { getByText } = await renderWithProvider(
      <EmptyState
        message="No coupons yet"
        actionLabel="Scan Coupon"
        onAction={onAction}
      />,
    );

    const button = getByText("Scan Coupon");
    expect(button).toBeTruthy();
    fireEvent.press(button);
    expect(onAction).toHaveBeenCalled();
  });

  it("does not render button when actionLabel is missing", async () => {
    const { queryByText } = await renderWithProvider(
      <EmptyState message="No coupons yet" />,
    );

    expect(queryByText("Scan Coupon")).toBeNull();
  });
});
