import Link from 'next/link';
import Image from 'next/image';
import { CartIconButton } from '../cart/CartIconButton';

export function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Mimoto" width={40} height={40} className="rounded" />
          <span className="font-semibold tracking-wide">Mimoto</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/servicios" className="hover:text-emerald-400 transition-colors">
            Servicios
          </Link>
          <Link href="/tienda" className="hover:text-emerald-400 transition-colors">
            Accesorios y Repuestos
          </Link>
          <Link href="/motos-usadas" className="hover:text-emerald-400 transition-colors">
            Motos usadas
          </Link>
          <Link href="/nosotros" className="hover:text-emerald-400 transition-colors">
            Nosotros
          </Link>
          <CartIconButton />
        </div>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { CartIconButton } from '../cart/CartIconButton';

export function Navbar() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Mimoto" width={40} height={40} className="rounded" />
          <span className="font-semibold tracking-wide">Mimoto</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-200">
          <Link href="/servicios">Servicios</Link>
          <Link href="/tienda">Accesorios y repuestos</Link>
          <Link href="/motos-usadas">Motos usadas</Link>
          <Link href="/nosotros">Nosotros</Link>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="flex items-center gap-4">
          <CartIconButton />
        </div>
      </div>
    </header>
  );
}


