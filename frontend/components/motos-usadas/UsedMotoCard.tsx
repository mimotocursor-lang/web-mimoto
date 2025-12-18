interface UsedMotoCardProps {
  moto: {
    id: number | string;
    title: string;
    price: number;
  };
}

export function UsedMotoCard({ moto }: UsedMotoCardProps) {
  return (
    <article className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 flex flex-col gap-3">
      <div className="aspect-video rounded-lg bg-zinc-800 mb-2" />
      <h3 className="font-semibold text-sm">{moto.title}</h3>
      <p className="text-sm text-emerald-400 font-semibold">
        ${moto.price.toLocaleString('es-CL')}
      </p>
      <a
        href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
        className="mt-auto inline-flex items-center justify-center px-3 py-2 rounded-full bg-emerald-500 text-zinc-900 text-sm font-semibold hover:bg-emerald-400 transition-colors"
      >
        Consultar por WhatsApp
      </a>
    </article>
  );
}

interface UsedMotoCardProps {
  moto: {
    id: number;
    title: string;
    price: number;
    year: number;
    mileage: number;
  };
}

export function UsedMotoCard({ moto }: UsedMotoCardProps) {
  return (
    <article className="border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-sm">{moto.title}</h2>
      <p className="text-xs text-neutral-400">
        Año {moto.year} · {moto.mileage.toLocaleString('es-CL')} km
      </p>
      <p className="text-lg font-bold">${moto.price.toLocaleString('es-CL')}</p>
      <a
        href="https://wa.me/XXXXXXXXXXX"
        className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition"
      >
        Consultar por WhatsApp
      </a>
    </article>
  );
}


