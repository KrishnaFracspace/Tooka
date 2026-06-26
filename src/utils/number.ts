/**
 * Safe numeric helpers for values that may arrive from the API as
 * numbers, numeric strings (e.g. "5.0"), null, undefined, or garbage.
 */

/**
 * Coerce an unknown value into a finite number.
 * Falls back to `fallback` for null / undefined / non-numeric / NaN / Infinity.
 */
export const toSafeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return fallback;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

/**
 * Format a rating-like value for display, guaranteed to be a string.
 * Safe against undefined / null / numeric strings / invalid values.
 */
export const formatRating = (
  value: unknown,
  fallback = 0,
  fractionDigits = 1,
): string => toSafeNumber(value, fallback).toFixed(fractionDigits);
