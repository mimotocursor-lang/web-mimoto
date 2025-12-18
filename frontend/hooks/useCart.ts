import { useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = 'mimoto_cart_v1';

function addToCart(items: CartItem[], newItem: CartItem): CartItem[] {
  const existing = items.find((i) => i.id === newItem.id);
  if (!existing) {
    return [...items, newItem];
  }
  return items.map((i) =>
    i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i,
  );
}

export function useCart() {
  const [state, setState] = useState<CartState>({ items: [] });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => {
    setState((prev) => ({ items: addToCart(prev.items, item) }));
  };

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    items: state.items,
    addItem,
    subtotal,
  };
}

import { create } from 'zustand';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  addItem: (item, quantity = 1) => {
    const current = get().items;
    const existing = current.find((i) => i.productId === item.productId);
    let next: CartItem[];

    if (existing) {
      next = current.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
      );
    } else {
      next = [...current, { ...item, quantity }];
    }

    const subtotal = next.reduce((acc, i) => acc + i.price * i.quantity, 0);
    set({ items: next, subtotal });
  },
  clear: () => set({ items: [], subtotal: 0 }),
}));


