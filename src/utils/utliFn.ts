export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  const discounted = originalPrice * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}

export function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const getCategoryEmoji = (category: string) => {
  const emojiMap: Record<string, string> = {
    beauty: '💄',
    fragrances: '🌸',
    furniture: '🪑',
    groceries: '🛒',
    'home-decoration': '🏠',
    'kitchen-accessories': '🍳',
    laptops: '💻',
    'mens-shirts': '👔',
    'mens-shoes': '👞',
    'mens-watches': '⌚',
    'mobile-accessories': '📱',
    motorcycle: '🏍️',
    'skin-care': '🧴',
    smartphones: '📱',
    'sports-accessories': '⚽',
    sunglasses: '🕶️',
    tablets: '📱',
    tops: '👕',
    vehicle: '🚗',
    'womens-bags': '👜',
    'womens-dresses': '👗',
    'womens-jewellery': '💍',
    'womens-shoes': '👠',
    'womens-watches': '⌚',
  };
  return emojiMap[category] || '🛍️';
};

export type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

// 🔧 시간 계산 유틸리티 함수 (순수 함수)
export function calculateTimeRemaining(endTime: Date): TimeLeft | null {
  const now = new Date().getTime();
  const difference = endTime.getTime() - now;

  if (difference <= 0) {
    return null; // 만료됨
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}
