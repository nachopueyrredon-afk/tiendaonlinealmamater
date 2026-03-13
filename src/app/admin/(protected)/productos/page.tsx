import Link from "next/link";

import { getAdminProducts } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

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
            {products.map((product) => {
              const stock = product.variants.length === 0 ? 1 : product.variants.reduce((acc, variant) => acc + variant.stock, 0);
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
                  <td className="px-5 py-4"><Link href={`/admin/productos/${product.id}`} className="text-brand-700">Editar</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
