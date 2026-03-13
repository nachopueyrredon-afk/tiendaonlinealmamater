import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/utils";
import type { StoreProduct } from "@/types/store";

export function ProductCard({ product }: { product: StoreProduct }) {
  const savings = product.regularPrice - product.transferPrice;
  const stock = product.stock;
  const visualTags = (product.tags ?? []).slice(0, 2);

  return (
    <article className="group overflow-hidden rounded-[1.9rem] border border-brand-900/10 bg-paper shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(16,28,48,0.12)]">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/70 via-brand-900/12 to-transparent p-5 text-white opacity-100 transition duration-500 sm:opacity-0 sm:group-hover:opacity-100">
            <p className="ui-label text-[10px] text-white/65">Pieza destacada</p>
            <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/82">Lectura mas cercana al objeto: imagen amplia, informacion medida y bloque comercial claro.</p>
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {visualTags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand-900/6 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-brand-700">
              {tag}
            </span>
          ))}
          {stock === 0 ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-red-700">
              sin stock
            </span>
          ) : null}
        </div>
        <div>
          <p className="ui-label text-[11px] text-brand-700/78">{product.line === "JOYERIA" ? "Joyeria" : "Imagenes"}</p>
          <Link href={`/producto/${product.slug}`} className="serif-title mt-3 block text-[1.65rem] text-brand-900 sm:text-[1.8rem]">
            {product.name}
          </Link>
          <p className="mt-3 max-w-[24ch] text-sm leading-7 text-brand-900/62">{product.subtitle}</p>
        </div>
        <div className="grid gap-2 rounded-[1.35rem] bg-brand-900 px-5 py-5 text-white">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-white/65">Precio regular</span>
            <span className="text-lg">{formatCurrency(product.regularPrice)}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-white/65">Transferencia</span>
            <span className="font-serif text-3xl">{formatCurrency(product.transferPrice)}</span>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-sm text-white/70">
            <span>Ahorro</span>
            <span>{formatCurrency(savings)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-brand-900/10 pt-4 text-sm text-brand-900/68">
          <span>{stock > 0 ? `${stock} disponible` : "Reposicion pendiente"}</span>
          <Link href={`/producto/${product.slug}`} className="ui-label text-[11px] text-brand-700 transition hover:text-brand-900">
            Ver pieza
          </Link>
        </div>
      </div>
    </article>
  );
}
