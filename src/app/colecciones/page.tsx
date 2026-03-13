import { getCollections } from "@/lib/catalog";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Colecciones</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-brand-900">Curadurias comerciales para navegar con rapidez y sentido</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-900/72">
            Las colecciones ordenan el catalogo con una entrada mas serena y editorial, evitando una lectura de marketplace.
          </p>
        </div>
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/55">Como navegar</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/80">
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Explora por sensibilidad, materialidad o contexto de regalo.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Cada bloque funciona como acceso directo a una lectura mas curada del catalogo.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Desde aqui podes seguir hacia producto con mas detalle tecnico y comercial.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {collections.map((collection) => (
          <article id={collection.slug} key={collection.id} className="rounded-[1.85rem] border border-brand-900/10 bg-paper p-7 shadow-soft">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Coleccion</p>
            <h2 className="mt-4 font-serif text-3xl text-brand-900">{collection.name}</h2>
            <p className="mt-4 text-sm leading-7 text-brand-900/72">{collection.description}</p>
            <p className="mt-6 border-t border-brand-900/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-brand-700/82">
              Acceso curado al catalogo
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
