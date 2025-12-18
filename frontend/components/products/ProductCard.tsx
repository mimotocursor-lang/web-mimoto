import { useCart } from '@hooks/useCart';

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    price: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 flex flex-col gap-3">
      <div className="aspect-video rounded-lg bg-zinc-800 mb-2" />
      <h3 className="font-semibold text-sm">{product.name}</h3>
      <p className="text-sm text-emerald-400 font-semibold">
        ${product.price.toLocaleString('es-CL')}
      </p>
      <button
        type="button"
        onClick={() =>
          addItem({
            id: String(product.id),
            name: product.name,
            price: product.price,
            quantity: 1,
          })
        }
        className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-full bg-emerald-500 text-zinc-900 text-sm font-semibold hover:bg-emerald-400 transition-colors"
      >
        Agregar al carrito
      </button>
    </article>
  );
}

import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
      <h2 className="font-semibold text-sm">{product.name}</h2>
      <p className="text-lg font-bold">${product.price.toFixed(0)}</p>
      <button
        type="button"
        onClick={() =>
          addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
          })
        }
        className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition"
      >
        Agregar al carrito
      </button>
    </article>
  );
}


