import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { getCatalogFilters, filterProducts } from "@/lib/catalog";

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    linea?: string;
    advocacion?: string;
    material?: string;
    precio?: string;
    stock?: string;
  }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const [filters, products] = await Promise.all([getCatalogFilters(), filterProducts(params)]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Catalogo"
        title="Un archivo visual mas curado, claro y silencioso"
        description="El catalogo conserva velocidad comercial, pero ordena filtros y producto con una lectura mas sobria, editorial y respirada."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-paper/90 p-6 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Criterio de archivo</p>
          <p className="mt-4 max-w-2xl font-serif text-3xl leading-[1.02] text-brand-900">
            Una seleccion pensada para lectura rapida, pero con la misma calma visual y presencia editorial del resto del recorrido.
          </p>
        </div>
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-6 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/60">Guia de compra</p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/78 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <p>Filtra por linea, advocacion o material.</p>
            <p>Compara precio regular y transferencia desde la grilla.</p>
            <p>Abre cada ficha con detalle tecnico y contexto visual.</p>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-7 rounded-[2rem] border border-brand-900/10 bg-paper/95 p-7 shadow-soft lg:sticky lg:top-28 lg:h-fit">
          <div>
            <p className="ui-label text-[11px] text-brand-700">Busqueda</p>
            <form className="mt-3">
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Buscar por nombre o coleccion"
                className="w-full rounded-full border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 placeholder:text-brand-900/35 focus:ring-2"
              />
            </form>
          </div>
          <FilterGroup title="Categoria" items={filters.categories.map((item) => item.name)} active={params.categoria} paramName="categoria" />
          <FilterGroup title="Linea" items={["RESINA_EPOXI", "JOYERIA"]} active={params.linea} paramName="linea" />
          <FilterGroup title="Advocacion" items={filters.devotions} active={params.advocacion} paramName="advocacion" />
          <FilterGroup title="Material" items={filters.materials} active={params.material} paramName="material" />
          <FilterGroup title="Precio" items={["0-90000", "90000-150000", "150000+"]} active={params.precio} paramName="precio" />
          <FilterGroup title="Stock" items={["disponible"]} active={params.stock} paramName="stock" />
        </aside>
        <div>
          <div className="mb-7 flex flex-col gap-3 rounded-[1.5rem] border border-brand-900/10 bg-paper/85 px-5 py-4 text-sm text-brand-900/66 shadow-soft md:flex-row md:items-center md:justify-between">
            <p><span className="font-serif text-2xl text-brand-900">{products.length}</span> piezas visibles</p>
            <p>Lectura consistente con home y ficha: tags medidas, imagen amplia y precio claro.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ title, items, active, paramName }: { title: string; items: string[]; active?: string; paramName: string }) {
  return (
    <div>
      <p className="ui-label text-[11px] text-brand-700">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item}
            href={`?${paramName}=${encodeURIComponent(item)}`}
            className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
              active === item
                ? "border-brand-900 bg-brand-900 text-white"
                : "border-brand-900/8 bg-brand-900/6 text-brand-900/82 hover:border-brand-900/14 hover:bg-brand-900/8"
            }`}
          >
            {item.replaceAll("_", " ")}
          </a>
        ))}
      </div>
    </div>
  );
}
