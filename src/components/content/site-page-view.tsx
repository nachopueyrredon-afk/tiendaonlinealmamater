export function SitePageView({ title, body }: { title: string; body: string }) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Informacion institucional</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-brand-900">{title}</h1>
          <p className="mt-5 text-base leading-8 text-brand-900/72">
            Contenido claro y sereno para acompanar la compra con la misma sensibilidad visual del resto del sitio.
          </p>
        </div>
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/55">Lectura rapida</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/80">
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Texto preparado para consulta rapida desde desktop y mobile.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Jerarquia mas clara para preguntas frecuentes, envios, pagos y contenido institucional.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">La marca mantiene tono sobrio, sin sonar tecnica ni impersonal.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[1.9rem] border border-brand-900/10 bg-paper/95 p-8 shadow-soft lg:p-10">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-brand-900/10 pb-5">
          <p className="ui-label text-[11px] text-brand-700">Detalle</p>
          <p className="text-sm text-brand-900/54">{paragraphs.length} bloques de contenido</p>
        </div>
        <div className="space-y-5 text-base leading-8 text-brand-900/72">
          {paragraphs.map((paragraph, index) => (
            <p key={`${title}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
