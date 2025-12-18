import { useCart } from '@hooks/useCart';

export function CartSummary() {
  const { items, subtotal } = useCart();

  return (
    <aside className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 space-y-3 text-sm">
      <h2 className="font-semibold text-base">Resumen del pedido</h2>
      {items.length === 0 ? (
        <p className="text-zinc-400">Agrega productos desde la tienda.</p>
      ) : (
        <>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toLocaleString('es-CL')}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-zinc-800 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toLocaleString('es-CL')}</span>
          </div>
          <button className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-zinc-900 font-semibold hover:bg-emerald-400 transition-colors">
            Ir al pago
          </button>
        </>
      )}
    </aside>
  );
}

import { useCart } from '../../hooks/useCart';

export function CartSummary() {
  const { items, subtotal } = useCart();

  return (
    <div className="border border-neutral-800 rounded-xl p-4 space-y-3">
      {items.length === 0 ? (
        <p className="text-neutral-400 text-sm">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(0)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-3 border-t border-neutral-800 text-sm font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(0)}</span>
          </div>
        </>
      )}
    </div>
  );
}


