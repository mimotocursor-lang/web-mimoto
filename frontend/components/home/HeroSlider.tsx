import Link from 'next/link';

// En producción deberías traer los banners desde el backend
const mockBanners = [
  {
    id: 1,
    title: 'Servicio técnico premium para tu moto',
    subtitle: 'Mantenciones, diagnósticos y reparaciones con garantía.',
  },
  {
    id: 2,
    title: 'Accesorios y equipamiento',
    subtitle: 'Equípate para ciudad, ruta y aventura.',
  },
];

export function HeroSlider() {
  const banner = mockBanners[0];
  return (
    <section className="relative bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
          <p className="text-zinc-300 mb-6">{banner.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tienda"
              className="inline-flex items-center px-6 py-3 bg-emerald-500 text-zinc-900 font-semibold rounded-full hover:bg-emerald-400 transition-colors"
            >
              Ver tienda
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
              className="inline-flex items-center px-6 py-3 border border-emerald-500 text-emerald-400 font-semibold rounded-full hover:bg-emerald-500/10 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="aspect-video rounded-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-500">
            Imagen promocional
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';

// En un siguiente paso se conectará a la API NestJS (/banners)
const mockBanners = [
  {
    id: 1,
    title: 'Servicio técnico especializado en motos',
    subtitle: 'Mantenciones, diagnósticos y reparaciones con garantía.',
    image_url: '/hero-1.jpg',
  },
];

export function HeroSlider() {
  const banner = mockBanners[0];

  return (
    <section className="relative bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{banner.title}</h1>
          <p className="text-neutral-300 mb-6">{banner.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/XXXXXXXXXXX"
              className="inline-flex items-center px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Agenda por WhatsApp
            </a>
            <a
              href="/tienda"
              className="inline-flex items-center px-6 py-3 rounded-full border border-neutral-600 text-neutral-100 hover:bg-neutral-800 transition"
            >
              Ver accesorios y repuestos
            </a>
          </div>
        </div>
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-neutral-800">
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}


