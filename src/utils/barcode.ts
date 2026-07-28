import { BARCODE_FORMATS } from "@/constants";

/**
 * Maps an expo-camera barcode type constant to a human-readable label.
 * Falls back to uppercasing the raw type if not found in the mapping.
 */
export function formatBarcodeType(type: string | null | undefined): string {
  if (!type) return "Unknown";
  return BARCODE_FORMATS[type.toLowerCase()] ?? type.toUpperCase();
}

/**
 * Basic validation for barcode values.
 * Returns true if the value is a non-empty string after trimming.
 */
export function isValidBarcodeValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.trim().length > 0;
}
