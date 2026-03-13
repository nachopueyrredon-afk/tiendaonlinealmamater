import Image from "next/image";
import { notFound } from "next/navigation";

import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { ProductCard } from "@/components/store/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(slug);
  const savings = product.regularPrice - product.transferPrice;
  const totalStock = product.variants.length === 0 ? 1 : product.variants.reduce((acc, item) => acc + item.stock, 0);
  const visualTags = [product.line === "JOYERIA" ? "Joyeria religiosa" : "Imagen religiosa", ...(product.tags ?? [])].slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-900/10 bg-paper shadow-soft">
            <Image src={product.images[0].url} alt={product.images[0].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/60 via-brand-900/8 to-transparent p-6 text-white">
              <p className="ui-label text-[11px] text-white/70">Lectura visual</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                Textura, escala y presencia del objeto en una composicion limpia, con foco en materialidad y gesto.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.slice(1).map((image) => (
              <div key={image.url} className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-brand-900/10 bg-paper">
                <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-brand-900/10 bg-paper/90 p-6 shadow-soft">
              <p className="editorial-kicker ui-label text-[11px] text-brand-700">Objeto con sentido</p>
              <p className="mt-4 max-w-xl font-serif text-3xl leading-[1.02] text-brand-900">
                Una pieza pensada para acompanar rituales cotidianos, regalo significativo y presencia serena en el espacio.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-6 text-white shadow-soft">
              <p className="ui-label text-[11px] text-white/60">Criterio comercial</p>
              <div className="mt-4 space-y-3 text-sm text-white/78">
                <p>Precio regular y transferencia visibles desde el primer pliegue.</p>
                <p>Stock, materiales y variantes claros antes de agregar al carrito.</p>
                <p>Informacion tecnica consolidada para reducir friccion en compra.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap gap-2">
            {visualTags.map((tag) => (
              <span key={tag} className="rounded-full border border-brand-900/10 bg-paper/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-700 shadow-soft">
                {tag}
              </span>
            ))}
          </div>
          <p className="editorial-kicker ui-label mt-6 text-[11px] text-brand-700">{product.categories[0]}</p>
          <h1 className="serif-title mt-5 max-w-xl text-5xl text-brand-900 lg:text-6xl">{product.name}</h1>
          <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-brand-900/72">{product.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-brand-900/10 bg-paper/90 px-4 py-4 shadow-soft">
              <p className="ui-label text-[10px] text-brand-700">Entrega</p>
              <p className="mt-2 text-sm leading-6 text-brand-900/72">Despacho coordinado con opciones a domicilio o retiro.</p>
            </div>
            <div className="rounded-[1.35rem] border border-brand-900/10 bg-paper/90 px-4 py-4 shadow-soft">
              <p className="ui-label text-[10px] text-brand-700">Materialidad</p>
              <p className="mt-2 text-sm leading-6 text-brand-900/72">{product.materials[0] || "Detalle de materiales disponible en ficha."}</p>
            </div>
            <div className="rounded-[1.35rem] border border-brand-900/10 bg-paper/90 px-4 py-4 shadow-soft">
              <p className="ui-label text-[10px] text-brand-700">Disponibilidad</p>
              <p className="mt-2 text-sm leading-6 text-brand-900/72">{totalStock > 0 ? `${totalStock} unidades listas para compra` : "Sin stock por el momento"}</p>
            </div>
          </div>

          <div className="mt-9 rounded-[1.9rem] bg-brand-900 p-7 text-white shadow-soft">
            <div className="flex items-center justify-between gap-4 text-sm text-white/65">
              <span>Precio regular</span>
              <span>{formatCurrency(product.regularPrice)}</span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <span className="text-sm text-white/65">Transferencia</span>
              <span className="font-serif text-5xl">{formatCurrency(product.transferPrice)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/72">
              <span>Ahorro por transferencia</span>
              <span>{formatCurrency(savings)}</span>
            </div>
            <div className="mt-4 rounded-[1.25rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/78">
              {product.installmentsText}
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
              <div>
                <p className="ui-label text-[10px] text-white/55">Transferencia</p>
                <p className="mt-1 text-sm text-white/78">Precio preferencial ya calculado en la experiencia de compra.</p>
              </div>
              <div>
                <p className="ui-label text-[10px] text-white/55">Compra cuidada</p>
                <p className="mt-1 text-sm text-white/78">Checkout claro con envio, datos tecnicos y resumen antes de confirmar.</p>
              </div>
            </div>
          </div>

          {product.variants.length > 0 ? (
            <div className="mt-9">
              <p className="ui-label text-[11px] text-brand-700">Variantes</p>
              <div className="mt-3 grid gap-3">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between rounded-[1.4rem] border border-brand-900/10 bg-paper px-5 py-4 shadow-soft">
                    <div>
                      <p className="font-serif text-2xl text-brand-900">{variant.name}</p>
                      <p className="text-sm text-brand-900/65">{variant.material} {variant.devotion ? `- ${variant.devotion}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-brand-900">{formatCurrency(variant.transferPrice)}</p>
                      <p className="text-sm text-brand-900/65">Stock: {variant.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <AddToCartForm product={product} />

          <dl className="mt-10 grid gap-5 rounded-[1.9rem] border border-brand-900/10 bg-paper/95 p-7 shadow-soft sm:grid-cols-2">
            <MetaItem label="SKU" value={product.sku} />
            <MetaItem label="Stock" value={totalStock > 0 ? `${totalStock} disponible` : "Sin stock"} />
            <MetaItem label="Materiales" value={product.materials.join(", ")} />
            <MetaItem label="Advocacion" value={product.devotions.join(", ") || "No aplica"} />
            <MetaItem label="Dimensiones" value={product.dimensions || "A confirmar"} />
            <MetaItem label="Peso aprox." value={product.weightGrams ? `${product.weightGrams} g` : "A confirmar"} />
            <MetaItem label="Colecciones" value={product.collections.join(", ")} />
            <MetaItem label="Cuidados" value={product.careInstructions || "Segun ficha del producto"} />
          </dl>
        </div>
      </div>

      <div className="mt-24">
        <div className="max-w-2xl">
          <p className="editorial-kicker ui-label text-xs text-brand-700">Relacionados</p>
          <h2 className="serif-title mt-5 text-4xl text-brand-900 lg:text-5xl">Otras piezas que dialogan con esta eleccion</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="ui-label text-[11px] text-brand-700">{label}</dt>
      <dd className="mt-2 text-sm leading-7 text-brand-900/72">{value}</dd>
    </div>
  );
}
