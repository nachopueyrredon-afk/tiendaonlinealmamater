import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getCollections, getFeaturedProducts, getHomeBlocks } from "@/lib/catalog";

export default async function HomePage() {
  const [featuredProducts, collections, homeBlocks] = await Promise.all([getFeaturedProducts(), getCollections(), getHomeBlocks()]);
  const heroBlock = homeBlocks.find((block) => block.key === "home-hero");
  const brandBlock = homeBlocks.find((block) => block.key === "home-brand-story");
  const editorialBand = homeBlocks.find((block) => block.key === "home-editorial-band");
  const operationalBand = homeBlocks.find((block) => block.key === "home-operational-band");

  const heroContent = heroBlock?.content as {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: { label?: string; href?: string };
    secondaryCta?: { label?: string; href?: string };
  } | undefined;
  const brandContent = brandBlock?.content as { items?: Array<{ title: string; description: string; note: string }>; eyebrow?: string } | undefined;
  const editorialContent = editorialBand?.content as { leftEyebrow?: string; rightEyebrow?: string; rightBody?: string } | undefined;
  const operationalContent = operationalBand?.content as { eyebrow?: string; cardEyebrow?: string; cardTitle?: string; cardCtaLabel?: string; cardCtaHref?: string } | undefined;
  const pillars = brandContent?.items ?? [];

  return (
    <>
      <Hero content={{
        eyebrow: heroContent?.eyebrow,
        title: heroBlock?.title || heroContent?.title,
        description: heroBlock?.subtitle || heroContent?.description,
        primaryCta: heroContent?.primaryCta,
        secondaryCta: heroContent?.secondaryCta,
      }} />
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-brand-900/10 bg-paper/90 p-8 shadow-soft">
            <p className="editorial-kicker eyebrow text-xs uppercase text-brand-700">{brandContent?.eyebrow || "La marca"}</p>
            <h2 className="display-serif mt-5 max-w-lg font-serif text-4xl leading-[0.95] text-brand-900 sm:text-5xl">
              {brandBlock?.title || "Una experiencia de compra mas cercana al objeto que a la oferta."}
            </h2>
            <p className="mt-6 max-w-md text-[1.02rem] leading-8 text-brand-900/72">
              {brandBlock?.subtitle || "El home evita el tono de marketplace y trabaja un ritmo mas contemplativo: aire, jerarquia, entradas claras y producto protagonista."}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[1.75rem] border border-brand-900/10 bg-paper/90 p-7 shadow-soft">
              <p className="eyebrow text-[11px] uppercase text-brand-700">Base del proyecto</p>
              <h2 className="mt-5 font-serif text-3xl leading-tight text-brand-900">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-6 text-brand-900/72">{pillar.description}</p>
              <p className="mt-6 border-t border-brand-900/10 pt-4 text-xs uppercase tracking-[0.18em] text-brand-900/52">{pillar.note}</p>
            </article>
          ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <SectionHeading
          eyebrow="Colecciones"
          title="Una navegacion mas curada, con entradas claras y silenciosas"
          description="En lugar de apilar banners, el home propone accesos precisos a colecciones que ordenan la compra con una sensibilidad mas editorial."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          {collections.map((collection) => (
            <article key={collection.id} className="group relative overflow-hidden rounded-[2rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-900/[0.03] blur-2xl transition duration-500 group-hover:scale-125" />
              <p className="eyebrow text-[11px] uppercase text-brand-700">Coleccion</p>
              <h3 className="mt-5 max-w-xs font-serif text-[2.25rem] leading-[0.95] text-brand-900">{collection.name}</h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-brand-900/72">{collection.description}</p>
              <ButtonLink href={`/colecciones#${collection.slug}`} variant="ghost" className="mt-8 px-0 tracking-[0.14em]">
                Explorar seleccion
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-brand-900/10 bg-brand-900 p-8 text-white shadow-soft">
            <p className="eyebrow text-[11px] uppercase text-white/60">{editorialContent?.leftEyebrow || "Curaduria"}</p>
            <p className="mt-5 font-serif text-4xl leading-[1.02]">
              {editorialBand?.title || "Regalos con sentido, piezas de hogar y joyeria devocional con una lectura mas actual."}
            </p>
          </div>
          <div className="rounded-[2rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
            <p className="eyebrow text-[11px] uppercase text-brand-700">{editorialContent?.rightEyebrow || "Criterio visual"}</p>
            <p className="mt-5 max-w-xl text-[1.04rem] leading-8 text-brand-900/72">
              {editorialContent?.rightBody || editorialBand?.subtitle || "Mucho aire, menos bloques, mejor jerarquia. El producto lidera y la informacion comercial aparece con precision, sin perder calidez ni valor de marca."}
            </p>
          </div>
        </div>
        <SectionHeading
          eyebrow="Destacados"
          title="Producto protagonista, precio claro y presencia editorial"
          description="Cada ficha sostiene una lectura mas premium: imagen amplia, etiquetas medidas, tipografia con caracter y bloque comercial limpio."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="border-y border-brand-900/10 bg-[linear-gradient(145deg,#101c30,#1e375c)] px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="editorial-kicker eyebrow text-xs uppercase text-white/60">{operationalContent?.eyebrow || "Base operativa"}</p>
            <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-[0.98] sm:text-5xl">
              {operationalBand?.title || "Una tienda contemplativa en lenguaje visual, pero rigurosa en operacion comercial, stock, pedidos y backoffice."}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              {operationalBand?.subtitle || "El siguiente salto natural es terminar la capa transaccional con Mercado Pago y afinar el sistema visual final con los assets reales de marca."}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
            <p className="eyebrow text-[11px] uppercase text-white/55">{operationalContent?.cardEyebrow || "Acceso rapido"}</p>
            <p className="mt-4 font-serif text-3xl leading-tight">{operationalContent?.cardTitle || "Backoffice conectado a Supabase y listo para seguir creciendo."}</p>
            <ButtonLink href={operationalContent?.cardCtaHref || "/admin"} variant="secondary" className="mt-6 w-full bg-white text-brand-900 hover:bg-sand-100">
              {operationalContent?.cardCtaLabel || "Ver backoffice"}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
