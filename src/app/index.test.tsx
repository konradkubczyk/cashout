import React from "react";
import { render } from "@testing-library/react-native";
import Index from "./index";

describe("Index screen", () => {
  it("renders correctly", () => {
    const result = render(<Index />);
    expect(result).toBeTruthy();
  });
});
