import { ProductLine, ProductStatus } from "@prisma/client";

import { saveProductAction } from "./actions";

type Category = {
  id: string;
  name: string;
};

type ProductData = {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string;
  line: ProductLine;
  status: ProductStatus;
  sku: string;
  regularPrice: number;
  transferPrice: number;
  baseStock: number;
  installmentsText: string | null;
  dimensions: string | null;
  weightGrams: number | null;
  careInstructions: string | null;
  isFeatured: boolean;
  categories: Array<{ category: { id: string } }>;
  images: Array<{ url: string; alt: string }>;
};

export function ProductForm({ product, categories }: { product?: ProductData | null; categories: Category[] }) {
  const selectedCategories = new Set(product?.categories.map((entry) => entry.category.id) ?? []);
  const imageLines = product?.images.map((image) => `${image.url} | ${image.alt}`).join("\n") ?? "";

  return (
    <form action={saveProductAction} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" encType="multipart/form-data">
      <input type="hidden" name="productId" value={product?.id ?? ""} />

      <section className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Ficha principal</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Nombre" defaultValue={product?.name} className="sm:col-span-2" />
          <Field name="slug" label="Slug" defaultValue={product?.slug} />
          <Field name="sku" label="SKU" defaultValue={product?.sku} />
          <Field name="subtitle" label="Bajada" defaultValue={product?.subtitle ?? ""} className="sm:col-span-2" />
          <Select name="line" label="Linea" defaultValue={product?.line ?? ProductLine.RESINA_EPOXI} options={[ProductLine.RESINA_EPOXI, ProductLine.JOYERIA]} />
          <Select name="status" label="Estado" defaultValue={product?.status ?? ProductStatus.DRAFT} options={[ProductStatus.DRAFT, ProductStatus.PUBLISHED, ProductStatus.ARCHIVED]} />
          <Field name="regularPrice" label="Precio regular" type="number" defaultValue={product?.regularPrice?.toString() ?? "0"} />
          <Field name="transferPrice" label="Precio transferencia" type="number" defaultValue={product?.transferPrice?.toString() ?? "0"} />
          <Field name="baseStock" label="Stock base" type="number" defaultValue={product?.baseStock?.toString() ?? "0"} />
          <Field name="installmentsText" label="Cuotas" defaultValue={product?.installmentsText ?? ""} className="sm:col-span-2" />
          <Field name="dimensions" label="Dimensiones" defaultValue={product?.dimensions ?? ""} />
          <Field name="weightGrams" label="Peso en gramos" type="number" defaultValue={product?.weightGrams?.toString() ?? ""} />
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Descripcion</span>
            <textarea name="description" rows={6} defaultValue={product?.description} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" required />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Cuidados</span>
            <textarea name="careInstructions" rows={4} defaultValue={product?.careInstructions ?? ""} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
        </div>
      </section>

      <div className="space-y-8">
        <section className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Categorias</h2>
            <label className="flex items-center gap-2 text-sm text-brand-900/72">
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
              destacado
            </label>
          </div>
          <div className="mt-4 grid gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 rounded-[1rem] border border-brand-900/10 bg-white px-4 py-3 text-sm text-brand-900">
                <input type="checkbox" name="categoryIds" value={category.id} defaultChecked={selectedCategories.has(category.id)} />
                {category.name}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Imagenes</h2>
          <p className="mt-2 text-sm leading-6 text-brand-900/66">Una linea por imagen en formato `url | alt`. La primera queda como principal.</p>
          <textarea name="images" rows={8} defaultValue={imageLines} className="mt-4 w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" placeholder="https://... | Imagen principal" />
          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-brand-900/75">Subir archivos</span>
            <input name="imageFiles" type="file" accept="image/*" multiple className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
        </section>

        <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">
          Guardar producto
        </button>
      </div>
    </form>
  );
}

function Field({ name, label, defaultValue, className, type = "text" }: { name: string; label: string; defaultValue?: string; className?: string; type?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
    </label>
  );
}

function Select({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: string[] }) {
  return (
    <label>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <select name={name} defaultValue={defaultValue} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
