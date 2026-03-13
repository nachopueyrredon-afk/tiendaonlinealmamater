import { redirect } from "next/navigation";

import { CheckoutForm } from "@/app/checkout/checkout-form";
import { getCartDetail } from "@/lib/cart";

export default async function CheckoutPage() {
  const cart = await getCartDetail();

  if (cart.items.length === 0) {
    redirect("/carrito");
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-brand-900/10 bg-paper/92 p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Checkout</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-brand-900">Claridad comercial para pago, envio y ahorro por transferencia</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-900/72">
            El cierre de compra sostiene la misma calma visual del recorrido, pero con foco en confianza, lectura rapida y confirmacion sin friccion.
          </p>
        </div>
        <div className="rounded-[2rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/55">Antes de confirmar</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/80">
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Elegis envio y medio de pago con el total actualizado en tiempo real.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">La transferencia mantiene el ahorro visible durante todo el checkout.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">La orden se crea con datos reales de contacto, direccion y notas.</p>
          </div>
        </div>
      </div>
      <CheckoutForm cart={cart} />
    </section>
  );
}
