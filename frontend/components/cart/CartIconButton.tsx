import { CartSidebar } from './CartSidebar';
import { useState } from 'react';

export function CartIconButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 hover:border-emerald-500 transition-colors"
      >
        🛒
      </button>
      <CartSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}

import { useCartSidebar } from '../../hooks/useCartSidebar';

export function CartIconButton() {
  const { open } = useCartSidebar();

  return (
    <button
      type="button"
      onClick={open}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-neutral-600 hover:bg-neutral-800 transition"
      aria-label="Abrir carrito"
    >
      🛒
    </button>
  );
}


