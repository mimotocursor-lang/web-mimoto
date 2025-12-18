import { UsedMotoGrid } from '@components/motos-usadas/UsedMotoGrid';

export default function MotosUsadasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Motos usadas</h1>
      <p className="text-zinc-300 mb-8">
        Vitrina de motos usadas seleccionadas. No se compran online, coordina con
        nosotros por WhatsApp para ver la unidad en persona.
      </p>
      <UsedMotoGrid />
    </section>
  );
}

import { UsedMotoGrid } from '../../components/motos-usadas/UsedMotoGrid';

export default function MotosUsadasPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Motos usadas</h1>
      <p className="text-neutral-300 mb-6">
        Vitrina de motos usadas revisadas. No se compran online: revisa la ficha y contáctanos por
        WhatsApp para coordinar visita y cierre de negocio.
      </p>
      <UsedMotoGrid />
    </section>
  );
}


