const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || '#';

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 md:right-6 inline-flex items-center px-4 py-3 rounded-full bg-emerald-500 text-zinc-900 font-semibold shadow-lg hover:bg-emerald-400 transition-colors"
    >
      WhatsApp
    </a>
  );
}

export function WhatsAppFloatingButton() {
  const whatsappUrl = 'https://wa.me/XXXXXXXXXXX';

  return (
    <a
      href={whatsappUrl}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-black shadow-lg hover:bg-green-400 transition"
      aria-label="Contactar por WhatsApp"
    >
      WA
    </a>
  );
}


