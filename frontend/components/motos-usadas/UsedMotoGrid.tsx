import { UsedMotoCard } from './UsedMotoCard';

const mockMotos = [
  { id: 1, title: 'KTM 790 Adventure', price: 8990000 },
  { id: 2, title: 'Honda CB500X', price: 6490000 },
  { id: 3, title: 'Yamaha Tenere 700', price: 9990000 },
];

export function UsedMotoGrid() {
  // En producción, aquí llamarías a la API de NestJS para obtener motos usadas activas
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mockMotos.map((m) => (
        <UsedMotoCard key={m.id} moto={m} />
      ))}
    </div>
  );
}

import { UsedMotoCard } from './UsedMotoCard';

// Se conectará a /used-motorcycles
const mockMotos = [
  {
    id: 1,
    title: 'KTM Adventure 790',
    price: 8990000,
    year: 2020,
    mileage: 18000,
  },
];

export function UsedMotoGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {mockMotos.map((moto) => (
        <UsedMotoCard key={moto.id} moto={moto} />
      ))}
    </div>
  );
}


