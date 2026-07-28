/**
 * Date utility functions.
 * All dates in the app are stored as ISO 8601 UTC strings.
 */

/**
 * Returns the current time as an ISO 8601 UTC string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Formats an ISO 8601 date string into a human-readable format.
 * Example: "Jul 28, 2026"
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Returns a relative expiry description.
 * Examples: "Expires in 3 days", "Expires today", "Expired 2 days ago"
 */
export function formatRelativeExpiry(
  isoString: string | null | undefined,
): string {
  if (!isoString) return "No expiry date";
  try {
    const expiryDate = new Date(isoString);
    if (isNaN(expiryDate.getTime())) return "Invalid date";

    const now = new Date();
    // Compare at day granularity (ignore time)
    const expiryDay = new Date(
      expiryDate.getFullYear(),
      expiryDate.getMonth(),
      expiryDate.getDate(),
    );
    const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = expiryDay.getTime() - todayDay.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return absDays === 1
        ? "Expired 1 day ago"
        : `Expired ${absDays} days ago`;
    }
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    if (diffDays <= 30) return `Expires in ${diffDays} days`;
    const months = Math.round(diffDays / 30);
    return months === 1
      ? "Expires in ~1 month"
      : `Expires in ~${months} months`;
  } catch {
    return "Invalid date";
  }
}

/**
 * Checks whether a given ISO 8601 date string is in the past.
 */
export function isExpired(isoString: string | null | undefined): boolean {
  if (!isoString) return false;
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return false;
    return date.getTime() < Date.now();
  } catch {
    return false;
  }
}

/**
 * Returns the number of days until expiry (negative if expired).
 * Returns null if no expiry date is provided.
 */
export function daysUntilExpiry(
  isoString: string | null | undefined,
): number | null {
  if (!isoString) return null;
  try {
    const expiryDate = new Date(isoString);
    if (isNaN(expiryDate.getTime())) return null;

    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}
