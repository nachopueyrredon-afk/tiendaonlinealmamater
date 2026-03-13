import Link from "next/link";

import { getAdminHomeBlocks } from "@/lib/admin";
import { getSitePages } from "@/lib/site-pages";

export default async function AdminContentPage() {
  const [pages, blocks] = await Promise.all([getSitePages(), getAdminHomeBlocks()]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Contenido</p>
      <h1 className="mt-4 font-serif text-5xl text-brand-900">CMS liviano para operar sin tocar codigo</h1>
      <div className="mt-10">
        <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Home editable</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blocks.map((block) => (
            <article key={block.id} className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Home block</p>
              <h2 className="mt-3 font-serif text-3xl text-brand-900">{block.title || block.key}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-900/66">{block.key}</p>
              <Link href={`/admin/contenido/home/${block.id}`} className="mt-5 inline-flex text-sm text-brand-700">Editar bloque</Link>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Paginas institucionales</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <article key={page.slug} className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Pagina editable</p>
            <h2 className="mt-3 font-serif text-3xl text-brand-900">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-900/66">/{page.slug}</p>
            <Link href={`/admin/contenido/${page.slug}`} className="mt-5 inline-flex text-sm text-brand-700">
              Editar contenido
            </Link>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
