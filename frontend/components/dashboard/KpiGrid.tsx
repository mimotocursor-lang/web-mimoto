export function KpiGrid() {
  // En producción, este componente llamará al endpoint /dashboard/kpis del backend
  const mock = {
    totalSales: 12000000,
    totalOrders: 42,
    productsActive: 58,
    productsInactive: 7,
    usedActive: 5,
    usedInactive: 1,
  };

  const cards = [
    { label: 'Total de ventas', value: `$${mock.totalSales.toLocaleString('es-CL')}` },
    { label: 'Órdenes totales', value: mock.totalOrders },
    {
      label: 'Productos activos / inactivos',
      value: `${mock.productsActive} / ${mock.productsInactive}`,
    },
    {
      label: 'Motos activas / inactivas',
      value: `${mock.usedActive} / ${mock.usedInactive}`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 space-y-1"
        >
          <p className="text-xs text-zinc-400">{card.label}</p>
          <p className="text-lg font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export function KpiGrid() {
  // En un siguiente paso se conectará a la API NestJS (/dashboard/kpis)
  const kpis = {
    totalSales: 0,
    products: { active: 0, inactive: 0 },
    usedMotorcycles: { active: 0, inactive: 0 },
    totalOrders: 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-400 mb-1">Ventas totales</p>
        <p className="text-xl font-semibold">${kpis.totalSales.toFixed(0)}</p>
      </div>
      <div className="border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-400 mb-1">Productos activos</p>
        <p className="text-xl font-semibold">{kpis.products.active}</p>
      </div>
      <div className="border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-400 mb-1">Motos usadas activas</p>
        <p className="text-xl font-semibold">{kpis.usedMotorcycles.active}</p>
      </div>
      <div className="border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-400 mb-1">Órdenes totales</p>
        <p className="text-xl font-semibold">{kpis.totalOrders}</p>
      </div>
    </div>
  );
}


