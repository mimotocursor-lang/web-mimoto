import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@components/layout/Navbar';
import { Footer } from '@components/layout/Footer';
import { WhatsAppFloatingButton } from '@components/layout/WhatsAppFloatingButton';

export const metadata: Metadata = {
  title: 'Mimoto - Servicio técnico, accesorios y motos',
  description:
    'Servicio técnico de motos, reparación, venta de accesorios, repuestos y motos usadas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}

import type { ReactNode } from 'react';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WhatsAppFloatingButton } from '../components/layout/WhatsAppFloatingButton';

export const metadata = {
  title: 'Mimoto - Servicio técnico, accesorios y repuestos',
  description: 'Servicio técnico de motos, reparación, accesorios y repuestos.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-neutral-950 text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}


