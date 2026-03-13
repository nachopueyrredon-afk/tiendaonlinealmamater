"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CartDetailedItem } from "@/types/store";

const shippingOptions = [
  { value: "correo", name: "Correo Argentino a domicilio", eta: "3 a 6 dias habiles", price: 6400 },
  { value: "oca", name: "OCA a domicilio", eta: "2 a 5 dias habiles", price: 6900 },
  { value: "retiro", name: "Retiro acordado", eta: "Coordinacion manual", price: 0 },
] as const;

const paymentOptions = [
  { value: "mercadopago", name: "Mercado Pago", description: "Preparado para tarjeta, cuotas y preferencia externa." },
  { value: "transferencia", name: "Transferencia bancaria", description: "Se persiste el ahorro y el medio elegido en la orden." },
] as const;

type CartSummary = {
  items: CartDetailedItem[];
  count: number;
  subtotalRegular: number;
  subtotalTransfer: number;
};

export function CheckoutForm({ cart }: { cart: CartSummary }) {
  const [shippingMethod, setShippingMethod] = useState<(typeof shippingOptions)[number]["value"]>("correo");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentOptions)[number]["value"]>("transferencia");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ orderNumber?: string; error?: string } | null>(null);

  const selectedShipping = shippingOptions.find((option) => option.value === shippingMethod) ?? shippingOptions[0];
  const totalRegular = cart.subtotalRegular + selectedShipping.price;
  const totalTransfer = cart.subtotalTransfer + selectedShipping.price;
  const effectiveTotal = paymentMethod === "transferencia" ? totalTransfer : totalRegular;

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);

    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      line1: String(formData.get("line1") || ""),
      line2: String(formData.get("line2") || ""),
      city: String(formData.get("city") || ""),
      province: String(formData.get("province") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      shippingMethod,
      paymentMethod,
      notes: String(formData.get("notes") || ""),
    };

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setResult({ error: data.error || "No se pudo crear el pedido." });
      setPending(false);
      return;
    }

    setResult({ orderNumber: data.orderNumber });
    setPending(false);
    window.location.href = "/carrito";
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <form
        className="space-y-6"
        action={async (formData) => {
          await handleSubmit(formData);
        }}
      >
        <CheckoutCard eyebrow="Paso 1" title="Datos de contacto" description="Informacion base para comunicar el estado del pedido y validar la entrega.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="firstName" label="Nombre" placeholder="Clara" />
            <Field name="lastName" label="Apellido" placeholder="Aguirre" />
            <Field name="email" type="email" label="Email" placeholder="clara@email.com" />
            <Field name="phone" label="Telefono" placeholder="+54 9 11..." />
          </div>
        </CheckoutCard>

        <CheckoutCard eyebrow="Paso 2" title="Direccion y envio" description="Defini la direccion completa y elegi la alternativa de entrega mas conveniente.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="line1" label="Direccion" placeholder="Av. del Libertador 2400" className="sm:col-span-2" />
            <Field name="city" label="Ciudad" placeholder="Buenos Aires" />
            <Field name="province" label="Provincia" placeholder="Buenos Aires" />
            <Field name="postalCode" label="Codigo postal" placeholder="1425" />
            <Field name="line2" label="Departamento" placeholder="Opcional" />
          </div>
          <div className="mt-6 grid gap-3">
            {shippingOptions.map((option) => (
              <label key={option.value} className={`flex items-center justify-between rounded-[1.4rem] border px-5 py-4 shadow-soft transition ${shippingMethod === option.value ? "border-brand-900 bg-brand-900/5" : "border-brand-900/10 bg-white hover:border-brand-900/16"}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === option.value} onChange={() => setShippingMethod(option.value)} />
                  <div>
                    <p className="font-medium text-brand-900">{option.name}</p>
                    <p className="text-sm text-brand-900/65">{option.eta}</p>
                  </div>
                </div>
                <span className="text-sm text-brand-900">{option.price === 0 ? "Sin cargo" : formatCurrency(option.price)}</span>
              </label>
            ))}
          </div>
        </CheckoutCard>

        <CheckoutCard eyebrow="Paso 3" title="Pago" description="Elegi como queres pagar y revisa el impacto inmediato en el total final.">
          <div className="grid gap-3">
            {paymentOptions.map((option) => (
              <label key={option.value} className={`rounded-[1.4rem] border px-5 py-4 shadow-soft ${paymentMethod === option.value ? "border-brand-900 bg-brand-900/5" : "border-brand-900/10 bg-white"}`}>
                <div className="flex items-start gap-3">
                  <input type="radio" name="payment" checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} />
                  <div>
                    <p className="font-medium text-brand-900">{option.name}</p>
                    <p className="mt-1 text-sm leading-6 text-brand-900/65">{option.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-5 rounded-[1.3rem] border border-brand-900/10 bg-brand-900/[0.03] px-4 py-4 text-sm leading-6 text-brand-900/70">
            {paymentMethod === "transferencia"
              ? `Estas confirmando el total con ahorro aplicado: ${formatCurrency(totalRegular - totalTransfer)} menos que el precio regular.`
              : "Mercado Pago conserva la experiencia preparada para cuotas, tarjeta y preferencia externa cuando se conecten credenciales reales."}
          </div>
        </CheckoutCard>

        <CheckoutCard eyebrow="Paso 4" title="Notas para el pedido" description="Agrega referencias utiles para entrega, regalo o coordinacion posterior.">
          <label className="block">
            <span className="mb-2 block text-sm text-brand-900/75">Notas</span>
            <textarea name="notes" rows={4} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" placeholder="Indicaciones de entrega, regalo o referencia de pago." />
          </label>
        </CheckoutCard>
      </form>

      <aside className="h-fit rounded-[2rem] border border-brand-900/10 bg-brand-900 p-7 text-white shadow-soft xl:sticky xl:top-28">
        <p className="ui-label text-xs text-white/60">Resumen</p>
        <p className="mt-4 font-serif text-4xl leading-[0.96]">Tu compra, lista para confirmar</p>
        <p className="mt-3 text-sm leading-6 text-white/74">Revisa piezas, envio y medio de pago con el total actualizado antes de crear la orden.</p>
        <div className="mt-5 grid gap-3 rounded-[1.35rem] border border-white/10 bg-white/6 p-4 text-sm text-white/80 sm:grid-cols-3 xl:grid-cols-1">
          <div>
            <p className="ui-label text-[10px] text-white/55">Items</p>
            <p className="mt-2 font-serif text-2xl text-white">{cart.count}</p>
          </div>
          <div>
            <p className="ui-label text-[10px] text-white/55">Envio</p>
            <p className="mt-2 text-sm text-white/80">{selectedShipping.name}</p>
          </div>
          <div>
            <p className="ui-label text-[10px] text-white/55">Pago</p>
            <p className="mt-2 text-sm text-white/80">{paymentMethod === "transferencia" ? "Transferencia" : "Mercado Pago"}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {cart.items.map((item) => (
            <div key={`${item.productSlug}-${item.variantId ?? "base"}`} className="flex gap-3 rounded-[1.4rem] border border-white/10 bg-white/8 p-3">
              <div className="relative h-20 w-16 overflow-hidden rounded-[0.9rem] bg-white/10">
                <Image src={item.imageUrl} alt={item.imageAlt} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[1.45rem] leading-[1.02]">{item.productName}</p>
                <p className="mt-1 text-sm text-white/72">{item.variantName ?? item.sku}</p>
                <p className="mt-1 text-sm text-white/72">Cantidad {item.quantity}</p>
              </div>
              <div className="text-right text-sm">
                <p>{formatCurrency(item.lineTransferTotal)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-4 text-sm text-white/72">
          <div className="flex justify-between gap-4"><span>Items</span><span>{cart.count}</span></div>
          <div className="flex justify-between gap-4"><span>Subtotal regular</span><span>{formatCurrency(cart.subtotalRegular)}</span></div>
          <div className="flex justify-between gap-4"><span>Subtotal transferencia</span><span>{formatCurrency(cart.subtotalTransfer)}</span></div>
          <div className="flex justify-between gap-4"><span>Envio</span><span>{formatCurrency(selectedShipping.price)}</span></div>
          <div className="flex justify-between gap-4 border-t border-white/12 pt-4 text-base text-white"><span>Total elegido</span><span>{formatCurrency(effectiveTotal)}</span></div>
        </div>
        <div className="mt-6 rounded-[1.25rem] border border-white/12 bg-white/8 p-4 text-sm text-white/82">
          Ahorras {formatCurrency(totalRegular - totalTransfer)} eligiendo transferencia. Al confirmar, se crea la orden real y el carrito se vacia.
        </div>
        {result?.error ? <p className="mt-4 text-sm text-red-200">{result.error}</p> : null}
        {result?.orderNumber ? <p className="mt-4 text-sm text-emerald-200">Pedido creado: {result.orderNumber}</p> : null}
        <Button formAction={async (formData) => handleSubmit(formData)} className="mt-6 w-full bg-white text-brand-900 hover:bg-sand-100" disabled={pending}>
          {pending ? "Creando pedido..." : "Confirmar pedido"}
        </Button>
      </aside>
    </div>
  );
}

function CheckoutCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-brand-900/10 bg-paper/95 p-7 shadow-soft">
      <p className="ui-label text-[11px] text-brand-700">{eyebrow}</p>
      <h2 className="serif-title mt-4 text-3xl text-brand-900">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-900/68">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ name, label, placeholder, className, type = "text" }: { name: string; label: string; placeholder: string; className?: string; type?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <input name={name} type={type} placeholder={placeholder} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 placeholder:text-brand-900/35 focus:ring-2" required={name !== "line2"} />
    </label>
  );
}
