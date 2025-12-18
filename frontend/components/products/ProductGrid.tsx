import { ProductCard } from './ProductCard';

const mockProducts = [
  { id: 1, name: 'Casco Integral', price: 129990 },
  { id: 2, name: 'Chaqueta Adventure', price: 199990 },
  { id: 3, name: 'Guantes Verano', price: 29990 },
];

export function ProductGrid() {
  // En producción, aquí llamarías a la API de NestJS para obtener productos activos
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

import { ProductCard } from './ProductCard';

// En el futuro se conectará a la API NestJS (/products)
const mockProducts = [
  {
    id: 1,
    name: 'Casco integral touring',
    price: 129990,
  },
];

export function ProductGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}


