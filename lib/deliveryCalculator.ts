// IMPORTANT: This file is used server-side only.
// Product weight is never exposed to the frontend.
// Delivery calculations happen exclusively in API routes.

export const FREE_DELIVERY_THRESHOLD = 999;
export const DELIVERY_RATE_PER_500G = 80; // ₹80 per 500 grams

/**
 * Rounds weight up to nearest 500g bracket
 * e.g., 700g -> 1000g, 1200g -> 1500g
 */
export function roundUpToNearest500(weight: number): number {
  return Math.ceil(weight / 500) * 500;
}

/**
 * Calculates delivery fee based on total order weight
 * Weight is fetched server-side — never passed from client
 */
export function calculateDeliveryFee(totalWeightGrams: number, subtotal: number): number {
  if (subtotal > FREE_DELIVERY_THRESHOLD) {
    return 0;
  }
  const roundedWeight = roundUpToNearest500(totalWeightGrams);
  const units = roundedWeight / 500;
  return units * DELIVERY_RATE_PER_500G;
}

/**
 * Example:
 * 700g order, subtotal ₹500 -> 1000g -> 2 units -> ₹160
 * 1200g order, subtotal ₹500 -> 1500g -> 3 units -> ₹240
 * Any order, subtotal ₹1000+ -> ₹0 (free delivery)
 */
