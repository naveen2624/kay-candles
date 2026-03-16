// lib/cartStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // product_id
  variantId?: string; // product_variants.id (if chosen)
  name: string; // product name
  variantName?: string; // e.g. "Strawberry Latte"
  price: number;
  quantity: number;
  image_url: string; // variant image if has_variants, else product image
  category: string;
};

// Cart key = productId + variantId (so same product, diff variants = separate lines)
export function cartItemKey(item: Pick<CartItem, "id" | "variantId">) {
  return item.variantId ? `${item.id}::${item.variantId}` : item.id;
}

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const key = cartItemKey(item);
        const existing = get().items.find((i) => cartItemKey(i) === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              cartItemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => cartItemKey(i) !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) =>
            cartItemKey(i) === key ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "kay-candles-cart",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
