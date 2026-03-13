import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminCategories, getAdminProductById } from "@/lib/admin";

import { ProductForm } from "../product-form";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getAdminCategories()]);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Productos</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Editar producto</h1>
        </div>
        <Link href="/admin/productos" className="text-sm text-brand-700">Volver al listado</Link>
      </div>
      <ProductForm product={product} categories={categories} />
    </section>
  );
}
