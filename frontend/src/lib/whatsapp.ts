// Utilidades para WhatsApp
// Este archivo se usa en el servidor (Astro), por lo que puede usar import.meta.env

// Mensajes predefinidos por área
const mensajes = {
  servicios: 'Hola, me interesa conocer más sobre los servicios técnicos.',
  motos: 'Hola, me interesa información sobre motos usadas.',
  repuestos: 'Hola, me interesa consultar sobre repuestos y accesorios.'
};

// Función para obtener URL de WhatsApp según área
export function getWhatsAppUrl(area: 'servicios' | 'motos' | 'repuestos'): string {
  // Números de WhatsApp (configurar en variables de entorno)
  const WHATSAPP_SERVICIOS_MOTOS = import.meta.env.PUBLIC_WHATSAPP_SERVICIOS_MOTOS || '56912345678';
  const WHATSAPP_REPUESTOS = import.meta.env.PUBLIC_WHATSAPP_REPUESTOS || '56987654321';
  
  const numero = area === 'repuestos' ? WHATSAPP_REPUESTOS : WHATSAPP_SERVICIOS_MOTOS;
  const mensaje = mensajes[area];
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

