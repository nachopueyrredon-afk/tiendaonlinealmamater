import Link from "next/link";

import { ActionFeedback } from "@/components/admin/action-feedback";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { getAdminHomeBlocks } from "@/lib/admin";
import { getSitePages } from "@/lib/site-pages";

import { toggleHomeBlockActiveAction } from "./home/actions";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ feedback?: string }>;
}) {
  const params = await searchParams;
  const [pages, blocks] = await Promise.all([getSitePages(), getAdminHomeBlocks()]);
  const activeBlocks = blocks.filter((block) => block.isActive).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Contenido</p>
      <h1 className="mt-4 font-serif text-5xl text-brand-900">CMS liviano para operar sin tocar codigo</h1>
      <ActionFeedback feedback={params.feedback} />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Bloques home" value={String(blocks.length)} description="Componentes editables del inicio." />
        <MetricCard label="Activos" value={String(activeBlocks)} description="Bloques actualmente visibles en home." />
        <MetricCard label="Paginas" value={String(pages.length)} description="Paginas institucionales administrables." />
      </div>
      <div className="mt-10">
        <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Home editable</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blocks.map((block) => (
            <article key={block.id} className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.22em] text-brand-700">Home block</p>
              <h2 className="mt-3 font-serif text-3xl text-brand-900">{block.title || block.key}</h2>
              <p className="mt-3 text-sm leading-6 text-brand-900/66">{block.key}</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
                <span className={`rounded-full px-3 py-1 ${block.isActive ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                  {block.isActive ? "activo" : "inactivo"}
                </span>
                <span className="text-brand-900/45">Orden {block.sortOrder}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link href={`/admin/contenido/home/${block.id}`} className="text-brand-700">Editar bloque</Link>
                <form action={toggleHomeBlockActiveAction}>
                  <input type="hidden" name="id" value={block.id} />
                  <input type="hidden" name="isActive" value={block.isActive ? "false" : "true"} />
                  <ConfirmSubmitButton
                    className={block.isActive ? "text-amber-700" : "text-green-700"}
                    message={
                      block.isActive
                        ? `Vas a desactivar el bloque \"${block.title || block.key}\" del home.`
                        : `Vas a activar el bloque \"${block.title || block.key}\" en el home.`
                    }
                  >
                    {block.isActive ? "Desactivar" : "Activar"}
                  </ConfirmSubmitButton>
                </form>
                <Link href="/" className="text-brand-900/70">Ver home</Link>
              </div>
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
              <p className="mt-3 text-sm text-brand-900/55">Actualizacion rapida de contenido y metadata SEO.</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link href={`/admin/contenido/${page.slug}`} className="text-brand-700">
                  Editar contenido
                </Link>
                <Link href={`/${page.slug}`} className="text-brand-900/70">
                  Ver pagina
                </Link>
              </div>
            </article>
          ))}
        </div>
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
