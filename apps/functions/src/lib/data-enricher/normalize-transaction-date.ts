/**
 * Normalizes transactionDate values coming from AI / external systems into a valid Date.
 *
 * Why: Cosmos stores JSON and the web app later parses `transactionDate` using JS Date parsing.
 * Non-ISO strings like "2025-12-29 18:13 Europe/Warsaw" are not reliably parseable in browsers.
 *
 * Rules:
 * - If it's already a valid Date, keep it.
 * - If it looks like "YYYY-MM-DD ..." extract date/time and convert to ISO-like (no timezone) form.
 * - Otherwise, try `new Date(value)` as a last resort.
 * - If still invalid, fall back to the current date/time.
 */
export const normalizeTransactionDate = (value: unknown): Date => {
  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) {
      return value;
    }
    return new Date();
  }

  if (typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
    return new Date();
  }

  if (typeof value !== "string") {
    return new Date();
  }

  const input = value.trim();
  if (!input) {
    return new Date();
  }

  // Common problematic format example:
  // "2025-12-29 18:13 Europe/Warsaw"
  // Convert to "2025-12-29T18:13:00" (no timezone) which is reliably parseable.
  const ymdWithOptionalTime = input.match(
    /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2})(?::(\d{2}))?)?/
  );
  if (ymdWithOptionalTime) {
    const datePart = ymdWithOptionalTime[1];
    const timePart = ymdWithOptionalTime[2];
    const seconds = ymdWithOptionalTime[3] ?? "00";

    const isoLike = timePart
      ? `${datePart}T${timePart}:${seconds}`
      : `${datePart}T00:00:00`;

    const parsed = new Date(isoLike);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Last resort: attempt native parsing (implementation-dependent for non-ISO strings).
  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date();
};

