import { useCart } from '@hooks/useCart';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: Props) {
  const { items, subtotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <h2 className="font-semibold">Carrito</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          {items.length === 0 ? (
            <p className="text-zinc-400">Tu carrito está vacío.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} x ${item.price.toLocaleString('es-CL')}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-zinc-800 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

import { useCart } from '../../hooks/useCart';
import { useCartSidebar } from '../../hooks/useCartSidebar';

export function CartSidebar() {
  const { isOpen, close } = useCartSidebar();
  const { items, subtotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-neutral-950 border-l border-neutral-800 shadow-xl transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <h2 className="font-semibold">Carrito</h2>
          <button type="button" onClick={close} className="text-sm text-neutral-400">
            Cerrar
          </button>
        </div>
        <div className="p-4 flex flex-col h-[calc(100%-56px)]">
          <div className="flex-1 overflow-y-auto space-y-3">
            {items.length === 0 ? (
              <p className="text-neutral-400 text-sm">Tu carrito está vacío.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border border-neutral-800 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-400">
                      {item.quantity} x ${item.price.toFixed(0)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-neutral-800 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(0)}</span>
            </div>
            <a
              href="/checkout"
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition text-sm disabled:opacity-50"
            >
              Ir al checkout
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}


