import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminHomeBlockById } from "@/lib/admin";

import { saveHomeBlockAction } from "../actions";

export default async function AdminHomeBlockEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = await getAdminHomeBlockById(id);

  if (!block) notFound();

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Contenido / Home</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Editar bloque</h1>
        </div>
        <Link href="/admin/contenido" className="text-sm text-brand-700">Volver</Link>
      </div>
      <form action={saveHomeBlockAction} className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <input type="hidden" name="id" value={block.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">Titulo</span>
            <input name="title" defaultValue={block.title ?? ""} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">Orden</span>
            <input name="sortOrder" type="number" defaultValue={String(block.sortOrder)} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Subtitulo</span>
            <input name="subtitle" defaultValue={block.subtitle ?? ""} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Contenido JSON</span>
            <textarea name="content" rows={18} defaultValue={JSON.stringify(block.content, null, 2)} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 font-mono text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-900/75">
            <input type="checkbox" name="isActive" defaultChecked={block.isActive} />
            Bloque activo
          </label>
        </div>
        <button type="submit" className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Guardar bloque</button>
      </form>
    </section>
  );
}
