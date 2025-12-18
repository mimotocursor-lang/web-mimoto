export default function ServiciosPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Servicio técnico y reparación</h1>
      <p className="text-zinc-300 mb-4">
        Taller especializado en motos de calle, enduro y aventura. Trabajamos con
        repuestos originales y técnicos certificados para garantizar la máxima
        confianza y seguridad en cada trabajo.
      </p>
      <p className="text-zinc-300 mb-8">
        Escríbenos por WhatsApp para coordinar una evaluación, mantenciones
        programadas o reparaciones específicas.
      </p>
      <a
        href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
        className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-full transition-colors"
      >
        Agenda por WhatsApp
      </a>
    </section>
  );
}

export default function ServiciosPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Servicio técnico y reparación</h1>
      <p className="text-neutral-300 mb-4">
        Taller especializado en motos, enfocado en confianza, experiencia y atención personalizada.
      </p>
      <p className="text-neutral-300 mb-8">
        Agenda tu mantención, diagnóstico o reparación y conversemos por WhatsApp para coordinar
        fechas, costos y repuestos.
      </p>
      <a
        href="https://wa.me/XXXXXXXXXXX"
        className="inline-flex items-center px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition"
      >
        Hablar por WhatsApp
      </a>
    </section>
  );
}


