import {
  formatCents,
  parseToCents,
  isValidAmount,
} from "../../src/utils/money";

describe("formatCents", () => {
  it("formats EUR cents correctly", () => {
    expect(formatCents(125)).toBe("€1.25");
    expect(formatCents(0)).toBe("€0.00");
    expect(formatCents(50)).toBe("€0.50");
    expect(formatCents(1000)).toBe("€10.00");
    expect(formatCents(99)).toBe("€0.99");
  });

  it("formats with explicit EUR currency", () => {
    expect(formatCents(125, "EUR")).toBe("€1.25");
  });

  it("formats USD correctly", () => {
    expect(formatCents(125, "USD")).toBe("$1.25");
  });

  it("formats GBP correctly", () => {
    expect(formatCents(125, "GBP")).toBe("£1.25");
  });

  it("formats SEK (suffix currency) correctly", () => {
    expect(formatCents(125, "SEK")).toBe("1.25 kr");
  });

  it("handles unknown currency with code prefix", () => {
    expect(formatCents(125, "PLN")).toBe("PLN 1.25");
  });
});

describe("parseToCents", () => {
  it("parses decimal string to cents", () => {
    expect(parseToCents("1.25")).toBe(125);
    expect(parseToCents("0.50")).toBe(50);
    expect(parseToCents("10.00")).toBe(1000);
    expect(parseToCents("3")).toBe(300);
  });

  it("handles comma as decimal separator", () => {
    expect(parseToCents("1,25")).toBe(125);
  });

  it("handles whitespace", () => {
    expect(parseToCents("  1.25  ")).toBe(125);
  });

  it("returns null for invalid input", () => {
    expect(parseToCents("")).toBeNull();
    expect(parseToCents("abc")).toBeNull();
    expect(parseToCents("-1.25")).toBeNull();
  });

  it("returns 0 for zero input", () => {
    expect(parseToCents("0")).toBe(0);
    expect(parseToCents("0.00")).toBe(0);
  });
});

describe("isValidAmount", () => {
  it("returns true for valid amounts", () => {
    expect(isValidAmount("1.25")).toBe(true);
    expect(isValidAmount("0.50")).toBe(true);
    expect(isValidAmount("10")).toBe(true);
    expect(isValidAmount("1,25")).toBe(true);
  });

  it("returns false for invalid amounts", () => {
    expect(isValidAmount("")).toBe(false);
    expect(isValidAmount("abc")).toBe(false);
    expect(isValidAmount("0")).toBe(false);
    expect(isValidAmount("-1")).toBe(false);
  });
});
