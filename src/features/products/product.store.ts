import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './products.type';
import { calculateDiscountedPrice } from '@/utils/utliFn';
import { toast } from 'sonner';

export type CartItem = {
  product: Product;
  quantity: number;
  addedAt: string;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  // 특정 상품이 장바구니에 있는지 확인
  isInCart: (productId: number) => boolean;
  // 특정 상품의 장바구니 수량 가져오기
  getCartQuantity: (productId: number) => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity: number) => {
        const existingItem = get().items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // 이미 장바구니에 있는 상품이면 수량 업데이트
          const newQuantity = existingItem.quantity + quantity;
          const maxQuantity = product.stock;

          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
                : item
            ),
          }));
        } else {
          // 새로운 상품을 장바구니에 추가
          const newItem: CartItem = {
            product,
            quantity: Math.min(quantity, product.stock),
            addedAt: new Date().toISOString(),
          };

          set((state) => ({
            items: [...state.items, newItem],
          }));
        }
      },

      removeFromCart: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('장바구니를 전부 비웠습니다.');
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const discountedPrice = calculateDiscountedPrice(
            item.product.price,
            item.product.discountPercentage
          );
          return total + discountedPrice * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      isInCart: (productId: number) => {
        return get().items.some((item) => item.product.id === productId);
      },

      getCartQuantity: (productId: number) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
