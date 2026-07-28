/**
 * Monetary value utility functions.
 * All money is stored as integer cents to avoid floating-point errors.
 */

/**
 * Formats an integer cent value into a currency string.
 * Example: formatCents(125, 'EUR') → "€1.25"
 */
export function formatCents(cents: number, currency: string = "EUR"): string {
  const value = (cents / 100).toFixed(2);

  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    CHF: "CHF ",
  };

  const symbol = symbols[currency.toUpperCase()] ?? `${currency} `;

  // For currencies that use a suffix (kr), place after the value
  const suffixCurrencies = ["SEK", "NOK", "DKK"];
  if (suffixCurrencies.includes(currency.toUpperCase())) {
    return `${value} ${symbol}`;
  }

  return `${symbol}${value}`;
}

/**
 * Parses a decimal string (e.g., "1.25") into integer cents (125).
 * Returns null if the input is not a valid positive number.
 */
export function parseToCents(decimalString: string): number | null {
  if (!decimalString || decimalString.trim().length === 0) return null;

  // Allow comma as decimal separator (common in Europe)
  const normalized = decimalString.trim().replace(",", ".");
  const value = parseFloat(normalized);

  if (isNaN(value) || value < 0) return null;

  // Round to avoid floating-point issues: 1.25 * 100 = 124.99999...
  return Math.round(value * 100);
}

/**
 * Validates whether a string represents a valid monetary amount.
 * Accepts formats like "1.25", "1,25", "0.50", "3"
 */
export function isValidAmount(input: string): boolean {
  if (!input || input.trim().length === 0) return false;
  const normalized = input.trim().replace(",", ".");
  const value = parseFloat(normalized);
  return !isNaN(value) && value > 0 && isFinite(value);
}
