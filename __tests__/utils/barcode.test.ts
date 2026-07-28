import {
  formatBarcodeType,
  isValidBarcodeValue,
} from "../../src/utils/barcode";

describe("formatBarcodeType", () => {
  it("maps known barcode types to labels", () => {
    expect(formatBarcodeType("ean13")).toBe("EAN-13");
    expect(formatBarcodeType("code128")).toBe("Code 128");
    expect(formatBarcodeType("qr")).toBe("QR Code");
  });

  it("handles case insensitivity", () => {
    expect(formatBarcodeType("EAN13")).toBe("EAN-13");
    expect(formatBarcodeType("Code128")).toBe("Code 128");
  });

  it("returns uppercased raw type for unknown formats", () => {
    expect(formatBarcodeType("unknown_format")).toBe("UNKNOWN_FORMAT");
  });

  it('returns "Unknown" for null', () => {
    expect(formatBarcodeType(null)).toBe("Unknown");
  });

  it('returns "Unknown" for undefined', () => {
    expect(formatBarcodeType(undefined)).toBe("Unknown");
  });

  it('returns "Unknown" for empty string', () => {
    expect(formatBarcodeType("")).toBe("Unknown");
  });
});

describe("isValidBarcodeValue", () => {
  it("returns true for valid barcode strings", () => {
    expect(isValidBarcodeValue("4901234567890")).toBe(true);
    expect(isValidBarcodeValue("ABC-123")).toBe(true);
  });

  it("returns false for empty/whitespace strings", () => {
    expect(isValidBarcodeValue("")).toBe(false);
    expect(isValidBarcodeValue("   ")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isValidBarcodeValue(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isValidBarcodeValue(undefined)).toBe(false);
  });
});
