import { createCategoryAction, updateCategoryAction } from "@/app/admin/(protected)/productos/actions";
import { ActionFeedback } from "@/components/admin/action-feedback";
import { getAdminCategories } from "@/lib/admin";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ feedback?: string }>;
}) {
  const params = await searchParams;
  const categories = await getAdminCategories();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Categorias</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Gestion de categorias</h1>
      </div>
      <ActionFeedback feedback={params.feedback} />

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form action={createCategoryAction} className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Nueva categoria</h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm text-brand-900/75">Nombre</span>
            <input name="name" className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" required />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-brand-900/75">Descripcion</span>
            <textarea name="description" rows={4} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <button type="submit" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Guardar categoria</button>
        </form>

        <div className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Categorias actuales</h2>
          <div className="mt-5 grid gap-3">
            {categories.map((category) => (
              <form key={category.id} action={updateCategoryAction} className="rounded-[1rem] border border-brand-900/10 bg-white px-4 py-4">
                <input type="hidden" name="categoryId" value={category.id} />
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-end">
                  <label>
                    <span className="mb-2 block text-sm text-brand-900/75">Nombre</span>
                    <input name="name" defaultValue={category.name} className="w-full rounded-[0.9rem] border border-brand-900/12 bg-white px-3 py-2 text-sm outline-none ring-brand-700/30 focus:ring-2" required />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm text-brand-900/75">Descripcion</span>
                    <input name="description" defaultValue={category.description ?? ""} className="w-full rounded-[0.9rem] border border-brand-900/12 bg-white px-3 py-2 text-sm outline-none ring-brand-700/30 focus:ring-2" />
                  </label>
                  <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-2 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">
                    Guardar
                  </button>
                </div>
                <p className="mt-3 text-sm text-brand-900/58">/{category.slug}</p>
              </form>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
