export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <span>© {new Date().getFullYear()} Mimoto. Todos los derechos reservados.</span>
        <span>Servicio técnico, accesorios, repuestos y motos usadas.</span>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950" id="contacto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-neutral-400 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p>© {new Date().getFullYear()} Mimoto. Todos los derechos reservados.</p>
        <p>Contacto: taller@mimoto.cl · WhatsApp +56 9 XXXXXXXX</p>
      </div>
    </footer>
  );
}


