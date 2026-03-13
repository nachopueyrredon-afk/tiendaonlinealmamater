import Link from "next/link";
import { notFound } from "next/navigation";

import { getSitePageBySlug } from "@/lib/site-pages";

import { saveSitePageAction } from "../actions";

export default async function AdminContentEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getSitePageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Contenido</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Editar pagina</h1>
        </div>
        <Link href="/admin/contenido" className="text-sm text-brand-700">Volver</Link>
      </div>

      <form action={saveSitePageAction} className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <input type="hidden" name="id" value={page.id} />
        <input type="hidden" name="slug" value={page.slug} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Titulo</span>
            <input name="title" defaultValue={page.title} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" required />
          </label>
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">SEO title</span>
            <input name="seoTitle" defaultValue={page.seoTitle ?? ""} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">SEO description</span>
            <input name="seoDescription" defaultValue={page.seoDescription ?? ""} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-brand-900/75">Cuerpo</span>
            <textarea name="body" rows={14} defaultValue={page.body} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm leading-7 outline-none ring-brand-700/30 focus:ring-2" required />
          </label>
        </div>
        <button type="submit" className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Guardar pagina</button>
      </form>
    </section>
  );
}
