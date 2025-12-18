import { ProductGrid } from '@components/products/ProductGrid';

export default function TiendaPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Accesorios y repuestos</h1>
      <p className="text-zinc-300 mb-8">
        Compra online accesorios, equipamiento y repuestos seleccionados. El
        carrito y el checkout están disponibles para este catálogo.
      </p>
      <ProductGrid />
    </section>
  );
}

import { ProductGrid } from '../../components/products/ProductGrid';

export default function TiendaPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Accesorios y repuestos</h1>
      <p className="text-neutral-300 mb-6">
        Compra online tus accesorios y repuestos. Agrega al carrito y completa tu pedido en el
        checkout.
      </p>
      <ProductGrid />
    </section>
  );
}


