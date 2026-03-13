import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-session";

import { AdminLoginForm } from "./form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_0.85fr]">
        <div className="rounded-[2rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft lg:p-10">
          <p className="ui-label text-[11px] text-white/55">Backoffice</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-white">Acceso admin</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
            Ingreso estable para operar catalogo, pedidos y contenido con una capa visual alineada al resto del proyecto, pero enfocada en claridad operativa.
          </p>
          <div className="mt-8 grid gap-3 text-sm leading-6 text-white/78">
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Gestion de productos, precios y variantes.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Seguimiento de pedidos, pagos y envios.</p>
            <p className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Edicion de bloques del home y contenido institucional.</p>
          </div>
        </div>
        <div className="rounded-[2rem] border border-brand-900/10 bg-paper p-8 shadow-soft lg:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Ingreso seguro</p>
          <h2 className="mt-4 font-serif text-4xl text-brand-900">Panel operativo</h2>
          <p className="mt-4 text-base leading-7 text-brand-900/72">
            Usa las credenciales configuradas en entorno para entrar al panel y continuar la operacion diaria.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
