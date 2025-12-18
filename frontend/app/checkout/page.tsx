import { CartSummary } from '@components/cart/CartSummary';

export default function CheckoutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid gap-10 md:grid-cols-[2fr,1.5fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Datos de contacto</h2>
          <p className="text-zinc-300">
            Aquí irán los formularios para datos de envío y facturación
            conectados al backend de NestJS.
          </p>
        </div>
        <CartSummary />
      </div>
    </section>
  );
}

import { CartSummary } from '../../components/cart/CartSummary';

export default function CheckoutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CartSummary />
      {/* Aquí iría el formulario de datos del comprador y botón de pago */}
    </section>
  );
}


