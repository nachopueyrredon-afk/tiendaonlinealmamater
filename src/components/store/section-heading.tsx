export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="editorial-kicker eyebrow text-xs uppercase text-brand-700">{eyebrow}</p>
      <h2 className="serif-title mt-5 text-4xl text-brand-900 sm:text-5xl lg:text-[3.6rem]">{title}</h2>
      {description ? <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 text-brand-900/70">{description}</p> : null}
    </div>
  );
}
