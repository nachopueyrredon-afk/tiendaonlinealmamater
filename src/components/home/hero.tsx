import { ButtonLink } from "@/components/ui/button";

type HeroContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
};

export function Hero({ content }: { content?: HeroContent }) {
  const hero = {
    eyebrow: content?.eyebrow || "Editorial devotional commerce",
    title: content?.title || "Piezas religiosas contemporaneas con una presencia mas noble y silenciosa.",
    description:
      content?.description ||
      "ALMA MATER une imagineria en resina epoxi y joyeria religiosa en una experiencia visual clara, calida y confiable.",
    primaryCta: content?.primaryCta || { label: "Explorar catalogo", href: "/catalogo" },
    secondaryCta: content?.secondaryCta || { label: "Ver colecciones", href: "/colecciones" },
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-16">
      <div className="flex flex-col justify-center">
        <span className="editorial-kicker mb-5 text-xs uppercase tracking-[0.35em] text-brand-700">{hero.eyebrow}</span>
        <h1 className="serif-title max-w-3xl text-5xl text-brand-900 sm:text-6xl lg:text-7xl">
          {hero.title}
        </h1>
        <p className="mt-7 max-w-2xl text-[1.05rem] leading-8 text-brand-900/70 sm:text-[1.15rem]">
          {hero.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={hero.primaryCta.href || "/catalogo"} variant="primary">{hero.primaryCta.label || "Explorar catalogo"}</ButtonLink>
          <ButtonLink href={hero.secondaryCta.href || "/colecciones"} variant="secondary">{hero.secondaryCta.label || "Ver colecciones"}</ButtonLink>
        </div>
        <div className="mt-10 grid max-w-2xl gap-5 border-t border-brand-900/10 pt-6 sm:grid-cols-3">
          <div>
            <p className="font-serif text-3xl text-brand-900">03</p>
            <p className="mt-1 text-sm tracking-[0.08em] text-brand-900/62">imagenes activas en resina</p>
          </div>
          <div>
            <p className="font-serif text-3xl text-brand-900">+01</p>
            <p className="mt-1 text-sm tracking-[0.08em] text-brand-900/62">lenguaje para joyeria religiosa</p>
          </div>
          <div>
            <p className="font-serif text-3xl italic text-brand-900">AR</p>
            <p className="mt-1 text-sm tracking-[0.08em] text-brand-900/62">venta directa pensada para Argentina</p>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,rgba(16,28,48,0.98),rgba(30,55,92,0.86)),radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_38%)] p-8 text-white shadow-soft">
        <div className="absolute -right-14 top-10 h-40 w-40 rounded-full border border-white/10" />
        <div className="absolute -left-10 bottom-8 h-24 w-24 rounded-full border border-white/10" />
        <div className="absolute inset-x-10 top-0 h-px bg-white/30" />
        <div className="grid gap-8">
          <div>
            <p className="eyebrow text-xs uppercase text-white/65">Dos lineas con una misma sensibilidad</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-white/65">Imagenes</p>
                <p className="mt-2 font-serif text-[2rem] leading-none">Resina epoxi</p>
                <p className="mt-3 text-sm leading-6 text-white/75">Piezas serenas, visuales y nobles para regalar o habitar.</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-white/65">Joyeria</p>
                <p className="mt-2 font-serif text-[2rem] leading-none">Plata, oro y esmalte</p>
                <p className="mt-3 text-sm leading-6 text-white/75">Objetos de uso cotidiano con valor simbolico y material.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/12 bg-white/5 p-5">
            <p className="eyebrow text-xs uppercase text-white/60">Propuesta comercial</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-serif text-4xl">2</p>
                <p className="text-sm text-white/70">lineas de producto</p>
              </div>
              <div>
                <p className="font-serif text-4xl">2</p>
                <p className="text-sm text-white/70">precios por item</p>
              </div>
              <div>
                <p className="font-serif text-4xl">100%</p>
                <p className="text-sm text-white/70">gestionable desde admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
