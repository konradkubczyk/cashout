import React from "react";
import { render } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
  Stack: {
    Screen: () => null,
  },
}));

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => ({
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    runAsync: jest.fn().mockResolvedValue({}),
    execAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Mock the hooks to avoid async state updates after test teardown
jest.mock("../../src/hooks/use-coupons", () => ({
  useCoupons: () => ({
    coupons: [],
    archivedCoupons: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

import Index from "../../src/app/index";

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe("Index route", () => {
  it("renders without crashing", async () => {
    const result = await render(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <PaperProvider>
          <Index />
        </PaperProvider>
      </SafeAreaProvider>,
    );
    expect(result).toBeTruthy();
  });
});
