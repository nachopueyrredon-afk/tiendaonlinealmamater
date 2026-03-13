import Link from "next/link";

import { adminLogoutAction } from "./login/actions";

const adminNavigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/contenido", label: "Contenido" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(180,138,86,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(244,239,231,0.94))]">
      <div className="sticky top-0 z-40 border-b border-brand-900/10 bg-paper/88 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Backoffice ALMA MATER</p>
              <p className="mt-2 font-serif text-3xl leading-none text-brand-900">Operacion clara, sobria y conectada</p>
              <p className="mt-2 text-sm text-brand-900/72">Panel operativo para productos, pedidos, contenido y trazabilidad comercial.</p>
            </div>
            <div className="rounded-[1.5rem] border border-brand-900/10 bg-white/70 p-2 shadow-soft">
              <div className="flex flex-wrap items-center gap-2 text-sm text-brand-900/78">
                {adminNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 transition hover:bg-brand-900/5 hover:text-brand-900">
                    {item.label}
                  </Link>
                ))}
                <form action={adminLogoutAction}>
                  <button type="submit" className="rounded-full bg-brand-900 px-4 py-2 text-white transition hover:bg-brand-700">
                    Salir
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-16">{children}</div>
    </div>
  );
}
