export const DATABASE_NAME = "cashout.db";

export const DEFAULT_CURRENCY = "EUR";

/**
 * Mapping of expo-camera barcode type strings to user-friendly labels.
 * Based on the BarcodeType union from expo-camera.
 */
export const BARCODE_FORMATS: Record<string, string> = {
  aztec: "Aztec",
  ean13: "EAN-13",
  ean8: "EAN-8",
  qr: "QR Code",
  pdf417: "PDF417",
  upc_e: "UPC-E",
  datamatrix: "Data Matrix",
  code39: "Code 39",
  code93: "Code 93",
  itf14: "ITF-14",
  codabar: "Codabar",
  code128: "Code 128",
  upc_a: "UPC-A",
};

/**
 * Default barcode format when the scanner doesn't provide one
 * or for manual entry.
 */
export const DEFAULT_BARCODE_FORMAT = "code128";

/**
 * Barcode formats commonly used on bottle deposit coupons in Europe.
 * Subset shown in the format picker for manual entry.
 */
export const COMMON_BARCODE_FORMATS = [
  "ean13",
  "code128",
  "qr",
  "ean8",
  "code39",
] as const;
