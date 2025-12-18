import { UsedMotoCard } from '../motos-usadas/UsedMotoCard';

const mockUsed = [
  { id: 1, title: 'KTM 790 Adventure', price: 8990000 },
  { id: 2, title: 'Honda CB500X', price: 6490000 },
];

export function FeaturedUsedBikes() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold mb-4">Motos usadas destacadas</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mockUsed.map((m) => (
          <UsedMotoCard key={m.id} moto={m} />
        ))}
      </div>
    </section>
  );
}






