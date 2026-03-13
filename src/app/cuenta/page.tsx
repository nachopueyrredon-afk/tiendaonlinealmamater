import { ButtonLink } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-paper p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Mi cuenta</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-brand-900">Seguimiento simple de pedido y datos del cliente</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-900/72">
            Esta vista queda preparada para login de cliente, consulta de estado de orden, tracking y acceso a datos guardados.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/carrito">Ver carrito</ButtonLink>
            <ButtonLink href="/contacto" variant="secondary">Consultar pedido</ButtonLink>
          </div>
        </div>
        <div className="rounded-[1.9rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/55">Proximo modulo</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-white/80">
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Ingreso de cliente con historial de compras.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Consulta de tracking y estado operativo del pedido.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Edicion de direcciones y datos frecuentes para recompra.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-[1.9rem] border border-brand-900/10 bg-paper/92 p-8 shadow-soft">
        <p className="ui-label text-[11px] text-brand-700">Estado actual</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-brand-900/72">
          Por ahora el acceso de cliente todavia no esta habilitado. Mientras tanto, el recorrido sigue resolviendo compra, contacto y seguimiento desde carrito, checkout y paginas institucionales.
        </p>
      </div>
    </section>
  );
}
