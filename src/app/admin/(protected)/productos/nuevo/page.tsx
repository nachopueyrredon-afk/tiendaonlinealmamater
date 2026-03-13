import Link from "next/link";

import { getAdminCategories } from "@/lib/admin";

import { ProductForm } from "../product-form";

export default async function AdminNewProductPage() {
  const categories = await getAdminCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Productos</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Nuevo producto</h1>
        </div>
        <Link href="/admin/productos" className="text-sm text-brand-700">Volver al listado</Link>
      </div>
      <ProductForm categories={categories} />
    </section>
  );
}
