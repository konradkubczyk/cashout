import React from "react";
import { render } from "@testing-library/react-native";
import Index from "../../src/app/index";

jest.mock("@expo/ui", () => {
  const React = require("react");
  const { Text: NativeText, View } = require("react-native");

  return {
    Host: ({ children }: { children: unknown }) =>
      React.createElement(View, null, children),
    Column: ({ children }: { children: unknown }) =>
      React.createElement(View, null, children),
    Text: ({ children }: { children: unknown }) =>
      React.createElement(NativeText, null, children),
  };
});

describe("Index screen", () => {
  it("renders the Cashout welcome content", async () => {
    const { getByText } = await render(<Index />);

    expect(getByText("Cashout")).toBeTruthy();
    expect(
      getByText("Your digital wallet for bottle deposit coupons."),
    ).toBeTruthy();
  });
});
