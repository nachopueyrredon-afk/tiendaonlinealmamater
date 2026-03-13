"use client";

import { useMemo, useState } from "react";

import { addToCartAction } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { StoreProduct } from "@/types/store";

export function AddToCartForm({ product }: { product: StoreProduct }) {
  const defaultVariantId = product.variants.find((variant) => variant.isDefault)?.id ?? product.variants[0]?.id ?? "";
  const [variantId, setVariantId] = useState(defaultVariantId);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  const activeRegularPrice = selectedVariant?.regularPrice ?? product.regularPrice;
  const activeTransferPrice = selectedVariant?.transferPrice ?? product.transferPrice;
  const availableStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = availableStock <= 0;

  return (
    <form action={addToCartAction} className="mt-8 space-y-5">
      <input type="hidden" name="productSlug" value={product.slug} />
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ""} />

      {product.variants.length > 0 ? (
        <label className="block">
          <span className="ui-label mb-2 block text-[11px] text-brand-700">Variante</span>
          <select value={variantId} onChange={(event) => setVariantId(event.target.value)} className="w-full rounded-[1.1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2">
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} - {formatCurrency(variant.transferPrice)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <label>
          <span className="ui-label mb-2 block text-[11px] text-brand-700">Cantidad</span>
          <input
            name="quantity"
            type="number"
            min={1}
            max={Math.max(1, Math.min(10, availableStock))}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 1)}
            className="w-full rounded-[1.1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2"
            disabled={isOutOfStock}
          />
        </label>
        <div className="rounded-[1.4rem] border border-brand-900/10 bg-paper px-5 py-5 shadow-soft">
          <p className="ui-label text-[11px] text-brand-700">Precio activo</p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <span className="text-sm text-brand-900/65">Regular</span>
            <span className="text-brand-900">{formatCurrency(activeRegularPrice)}</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <span className="text-sm text-brand-900/65">Transferencia</span>
            <span className="font-serif text-2xl text-brand-900">{formatCurrency(activeTransferPrice)}</span>
          </div>
          <div className="mt-3 text-sm text-brand-900/65">
            {isOutOfStock ? "Sin stock disponible" : `${availableStock} unidades disponibles`}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button type="submit" disabled={isOutOfStock}>{isOutOfStock ? "Sin stock" : "Aniadir al carrito"}</Button>
        <Button type="button" className="bg-transparent text-brand-900 ring-1 ring-brand-900/15 hover:bg-brand-900/5">
          Consultar por WhatsApp
        </Button>
      </div>
    </form>
  );
}
