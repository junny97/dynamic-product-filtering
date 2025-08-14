export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  const discounted = originalPrice * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}
