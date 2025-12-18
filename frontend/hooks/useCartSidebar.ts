import { create } from 'zustand';

interface CartSidebarState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCartSidebar = create<CartSidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));


