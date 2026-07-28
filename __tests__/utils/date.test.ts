import {
  formatDate,
  formatRelativeExpiry,
  isExpired,
  nowISO,
  daysUntilExpiry,
} from "../../src/utils/date";

describe("nowISO", () => {
  it("returns a valid ISO 8601 string", () => {
    const result = nowISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    // Should be parseable
    expect(new Date(result).getTime()).not.toBeNaN();
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const result = formatDate("2026-07-28T10:00:00.000Z");
    expect(result).toContain("Jul");
    expect(result).toContain("28");
    expect(result).toContain("2026");
  });

  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("returns dash for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("returns dash for empty string", () => {
    expect(formatDate("")).toBe("—");
  });

  it("returns dash for invalid date", () => {
    expect(formatDate("not-a-date")).toBe("—");
  });
});

describe("formatRelativeExpiry", () => {
  it('returns "No expiry date" for null', () => {
    expect(formatRelativeExpiry(null)).toBe("No expiry date");
  });

  it('returns "Expires today" for today', () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    expect(formatRelativeExpiry(today.toISOString())).toBe("Expires today");
  });

  it('returns "Expires tomorrow" for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(formatRelativeExpiry(tomorrow.toISOString())).toBe(
      "Expires tomorrow",
    );
  });

  it('returns "Expired X days ago" for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(formatRelativeExpiry(past.toISOString())).toBe("Expired 5 days ago");
  });

  it('returns "Expires in X days" for near future', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(formatRelativeExpiry(future.toISOString())).toBe(
      "Expires in 10 days",
    );
  });
});

describe("isExpired", () => {
  it("returns true for past dates", () => {
    expect(isExpired("2020-01-01T00:00:00.000Z")).toBe(true);
  });

  it("returns false for future dates", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(isExpired(future.toISOString())).toBe(false);
  });

  it("returns false for null", () => {
    expect(isExpired(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isExpired(undefined)).toBe(false);
  });
});

describe("daysUntilExpiry", () => {
  it("returns null for null input", () => {
    expect(daysUntilExpiry(null)).toBeNull();
  });

  it("returns negative number for past dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const result = daysUntilExpiry(past.toISOString());
    expect(result).not.toBeNull();
    expect(result!).toBeLessThanOrEqual(0);
  });

  it("returns positive number for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    const result = daysUntilExpiry(future.toISOString());
    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(0);
  });
});
