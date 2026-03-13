import Link from "next/link";

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { getAdminProducts } from "@/lib/admin";
import { requireAdminPermission } from "@/lib/admin-session";
import { formatCurrency } from "@/lib/utils";

import { duplicateProductAction, setProductStatusAction } from "./actions";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    line?: string;
    feedback?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  await requireAdminPermission("products.manage");
  const params = await searchParams;
  const products = await getAdminProducts();
  const query = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "all";
  const line = params.line ?? "all";

  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query);

    const matchesStatus = status === "all" || product.status === status;
    const matchesLine = line === "all" || product.line === line;

    return matchesQuery && matchesStatus && matchesLine;
  });

  const publishedCount = products.filter((product) => product.status === "PUBLISHED").length;
  const draftCount = products.filter((product) => product.status === "DRAFT").length;
  const featuredCount = products.filter((product) => product.isFeatured).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Productos</p>
          <h1 className="mt-4 font-serif text-5xl text-brand-900">Catalogo administrable</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/productos/nuevo" className="inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-2 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Nuevo producto</Link>
          <Link href="/admin" className="text-sm text-brand-700">Volver al panel</Link>
        </div>
      </div>
      <ActionFeedback feedback={params.feedback} />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Publicados" value={publishedCount.toString()} description="Productos visibles en storefront." />
        <MetricCard label="Borradores" value={draftCount.toString()} description="Piezas pendientes de revision o carga final." />
        <MetricCard label="Destacados" value={featuredCount.toString()} description="Productos marcados para prioridad comercial." />
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_auto] lg:items-end">
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">Buscar por nombre, SKU o slug</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Ej. rosario, JOY-001 o virgen-del-carmen"
              className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 placeholder:text-brand-900/35 focus:ring-2"
            />
          </label>
          <FilterSelect
            name="status"
            label="Estado"
            defaultValue={status}
            options={[
              { value: "all", label: "Todos" },
              { value: "PUBLISHED", label: "Publicados" },
              { value: "DRAFT", label: "Borradores" },
              { value: "ARCHIVED", label: "Archivados" },
            ]}
          />
          <FilterSelect
            name="line"
            label="Linea"
            defaultValue={line}
            options={[
              { value: "all", label: "Todas" },
              { value: "RESINA_EPOXI", label: "Resina epoxi" },
              { value: "JOYERIA", label: "Joyeria" },
            ]}
          />
          <div className="flex gap-3 lg:justify-end">
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">
              Aplicar
            </button>
            <Link href="/admin/productos" className="inline-flex items-center justify-center rounded-full border border-brand-900/10 px-4 py-3 text-sm text-brand-900/78 transition hover:bg-brand-900/5">
              Limpiar
            </Link>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-brand-900/64">
          <span>
            <span className="font-serif text-2xl text-brand-900">{filteredProducts.length}</span> resultados visibles
          </span>
          {(query || status !== "all" || line !== "all") ? <span>Filtros activos aplicados al catalogo administrable.</span> : <span>Vista completa del catalogo administrable.</span>}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-paper shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-900 text-white">
            <tr>
              <th className="px-5 py-4 font-medium">Producto</th>
              <th className="px-5 py-4 font-medium">Linea</th>
              <th className="px-5 py-4 font-medium">Regular</th>
              <th className="px-5 py-4 font-medium">Transferencia</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Categorias</th>
              <th className="px-5 py-4 font-medium">Imagenes</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stock = product.variants.length === 0 ? product.baseStock : product.variants.reduce((acc, variant) => acc + variant.stock, 0);
              const statusTone = product.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700";

              return (
                <tr key={product.id} className="border-t border-brand-900/10">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-brand-900">{product.name}</p>
                      <p className="text-brand-900/60">{product.sku}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-900/72">{product.line}</td>
                  <td className="px-5 py-4 text-brand-900/72">{formatCurrency(product.regularPrice)}</td>
                  <td className="px-5 py-4 text-brand-900/72">{formatCurrency(product.transferPrice)}</td>
                  <td className="px-5 py-4 text-brand-900/72">{stock}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${statusTone}`}>{product.status.toLowerCase()}</span></td>
                  <td className="px-5 py-4 text-brand-900/72">{product.categories.map((entry) => entry.category.name).join(", ") || "-"}</td>
                  <td className="px-5 py-4 text-brand-900/72">{product.images.length}</td>
                   <td className="px-5 py-4">
                     <div className="flex flex-wrap gap-3 text-sm">
                       <Link href={`/admin/productos/${product.id}`} className="text-brand-700">
                         Editar
                       </Link>
                       {product.status !== "PUBLISHED" ? (
                         <form action={setProductStatusAction}>
                           <input type="hidden" name="productId" value={product.id} />
                           <input type="hidden" name="status" value="PUBLISHED" />
                           <button type="submit" className="text-green-700">
                             Publicar
                           </button>
                         </form>
                       ) : null}
                        {product.status !== "ARCHIVED" ? (
                          <form action={setProductStatusAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="status" value="ARCHIVED" />
                            <ConfirmSubmitButton className="text-amber-700" message={`Vas a archivar \"${product.name}\". Podras volver a borrador despues.`}>
                              Archivar
                            </ConfirmSubmitButton>
                          </form>
                        ) : (
                          <form action={setProductStatusAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="status" value="DRAFT" />
                           <button type="submit" className="text-brand-700">
                             Pasar a borrador
                           </button>
                         </form>
                        )}
                        <form action={duplicateProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <ConfirmSubmitButton className="text-brand-900/72" message={`Se creara una copia en borrador de \"${product.name}\" con imagenes y variantes.`}>
                            Duplicar
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                 </tr>
               );
             })}
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-brand-900/60">
                  No hay productos que coincidan con la combinacion actual de busqueda y filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <article className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.22em] text-brand-700">{label}</p>
      <p className="mt-3 font-serif text-4xl text-brand-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-brand-900/64">{description}</p>
    </article>
  );
}

function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
