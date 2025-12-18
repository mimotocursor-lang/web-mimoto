import { ProductCard } from '../products/ProductCard';

const mockProducts = [
  { id: 1, name: 'Casco Integral', price: 129990 },
  { id: 2, name: 'Guantes Touring', price: 39990 },
];

export function FeaturedProducts() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold mb-4">Accesorios destacados</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}






