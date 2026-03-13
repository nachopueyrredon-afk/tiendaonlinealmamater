import Image from "next/image";
import Link from "next/link";

import { clearCartAction, removeCartItemAction, updateCartItemAction } from "@/app/actions/cart";
import { ButtonLink } from "@/components/ui/button";
import { getCartDetail } from "@/lib/cart";
import { formatCurrency } from "@/lib/utils";

export default async function CartPage() {
  const cart = await getCartDetail();
  const shippingEstimate = cart.items.length > 0 ? 6400 : 0;
  const total = cart.subtotalTransfer + shippingEstimate;

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-xs text-brand-700">Carrito</p>
          <h1 className="serif-title mt-5 text-4xl text-brand-900 lg:text-5xl">Todavia no agregaste piezas</h1>
          <p className="mt-5 text-base leading-8 text-brand-900/72">Explora el catalogo y suma productos al carrito persistente. Va a seguir disponible durante tu sesion y entre visitas.</p>
          <ButtonLink href="/catalogo" className="mt-6">Ir al catalogo</ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] border border-brand-900/10 bg-paper/95 p-7 shadow-soft">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="editorial-kicker ui-label text-xs text-brand-700">Carrito</p>
              <h1 className="serif-title mt-5 text-4xl text-brand-900 lg:text-5xl">Resumen de piezas seleccionadas</h1>
            </div>
            <div className="flex items-center gap-4 text-sm tracking-[0.08em] text-brand-700">
              <form action={clearCartAction}>
                <button type="submit">Vaciar carrito</button>
              </form>
              <Link href="/catalogo">Seguir comprando</Link>
            </div>
          </div>
          <div className="mt-8 grid gap-4">
            {cart.items.map((item) => (
              <article key={`${item.productSlug}-${item.variantId ?? "base"}`} className="rounded-[1.65rem] border border-brand-900/10 bg-white p-5 shadow-soft">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-28 w-24 overflow-hidden rounded-[1rem] bg-sand-100">
                      <Image src={item.imageUrl} alt={item.imageAlt} fill className="object-cover" sizes="96px" />
                    </div>
                    <div>
                      <p className="font-serif text-[1.9rem] leading-[1.02] text-brand-900">{item.productName}</p>
                      <p className="mt-2 text-sm text-brand-900/65">SKU {item.sku}{item.variantName ? ` - ${item.variantName}` : ""}</p>
                      <p className="mt-4 text-sm leading-7 text-brand-900/72">Transferencia: {formatCurrency(item.transferPrice)} | Regular: {formatCurrency(item.regularPrice)}</p>
                    </div>
                  </div>
                  <div className="w-full max-w-xs space-y-3 md:text-right">
                    <p className="font-medium text-brand-900">{formatCurrency(item.lineTransferTotal)}</p>
                    <form action={updateCartItemAction} className="flex items-center gap-2 md:justify-end">
                      <input type="hidden" name="productSlug" value={item.productSlug} />
                      <input type="hidden" name="variantId" value={item.variantId ?? ""} />
                      <input name="quantity" type="number" min={1} max={Math.max(item.availableStock, 1)} defaultValue={item.quantity} className="w-20 rounded-full border border-brand-900/12 px-3 py-2 text-sm" />
                      <button type="submit" className="text-sm text-brand-700">Actualizar</button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="productSlug" value={item.productSlug} />
                      <input type="hidden" name="variantId" value={item.variantId ?? ""} />
                      <button type="submit" className="text-sm text-brand-700">Quitar</button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-[2rem] border border-brand-900/10 bg-brand-900 p-7 text-white shadow-soft">
          <p className="ui-label text-xs text-white/60">Tu compra</p>
          <div className="mt-6 space-y-4 text-sm text-white/72">
            <div className="flex justify-between gap-4">
              <span>Subtotal transferencia</span>
              <span>{formatCurrency(cart.subtotalTransfer)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Envio estimado</span>
              <span>{formatCurrency(shippingEstimate)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/12 pt-4 text-base text-white">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-[1.25rem] border border-white/12 bg-white/8 p-4 text-sm text-white/78">
            Ahorras {formatCurrency(cart.subtotalRegular - cart.subtotalTransfer)} si elegis transferencia.
          </div>
          <ButtonLink href="/checkout" className="mt-6 w-full" variant="secondary">
            Ir al checkout
          </ButtonLink>
        </aside>
      </div>
    </section>
  );
}
