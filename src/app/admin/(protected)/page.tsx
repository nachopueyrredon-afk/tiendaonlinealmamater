import Link from "next/link";

import { ActionFeedback } from "@/components/admin/action-feedback";
import { hasAdminPermission, type AdminPermission } from "@/lib/admin-permissions";
import { requireAdminSession } from "@/lib/admin-session";
import { getAdminDashboardStats } from "@/lib/admin";

const modules = [
  { title: "Productos y variantes", href: "/admin/productos", note: "Catalogo, precios, stock y estructura comercial.", permission: "products.manage" },
  { title: "Colecciones, materiales y advocaciones", href: "/admin/categorias", note: "Taxonomias para ordenar navegacion y lectura del objeto.", permission: "taxonomy.manage" },
  { title: "Pedidos, pagos y envios", href: "/admin/pedidos", note: "Seguimiento operativo de la compra y sus estados.", permission: "orders.manage" },
  { title: "Bloques editables del home", href: "/admin/contenido", note: "Narrativa de marca, bandas editoriales y mensajes clave.", permission: "content.manage" },
  { title: "Usuarios y perfiles", href: "/admin/usuarios", note: "Altas, perfiles y estados de acceso del backoffice.", permission: "users.manage" },
] as const satisfies Array<{ title: string; href: string; note: string; permission: AdminPermission }>;

const quickChecks = [
  "Revisar stock critico y variantes activas.",
  "Confirmar pedidos nuevos y medios de pago elegidos.",
  "Actualizar bloques del home segun foco comercial.",
];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ feedback?: string }> }) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const stats = await getAdminDashboardStats();
  const visibleModules = modules.filter((module) => hasAdminPermission(session.role, module.permission));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-brand-900/10 bg-paper/92 p-8 shadow-soft">
          <p className="editorial-kicker ui-label text-[11px] text-brand-700">Backoffice</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.94] text-brand-900">Panel de administracion ALMA MATER</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-900/72">
            Esta primera iteracion fija una operacion sobria y clara para productos, precios, stock, pedidos y contenido sin depender de codigo.
          </p>
        </div>
        <div className="rounded-[2rem] border border-brand-900/10 bg-[linear-gradient(155deg,#101c30,#213a60)] p-8 text-white shadow-soft">
          <p className="ui-label text-[11px] text-white/55">Chequeo rapido</p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-white/80">
            {quickChecks.map((item) => (
              <p key={item} className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      <ActionFeedback feedback={params.feedback} />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Productos</p>
          <p className="mt-3 font-serif text-4xl text-brand-900">{stats.productCount}</p>
          <p className="mt-2 text-sm text-brand-900/64">Piezas activas para catalogo y administracion de variantes.</p>
        </div>
        <div className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Pedidos</p>
          <p className="mt-3 font-serif text-4xl text-brand-900">{stats.orderCount}</p>
          <p className="mt-2 text-sm text-brand-900/64">Ordenes registradas con pago, envio y estado operativo.</p>
        </div>
        <div className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Clientes</p>
          <p className="mt-3 font-serif text-4xl text-brand-900">{stats.customerCount}</p>
          <p className="mt-2 text-sm text-brand-900/64">Base inicial de compradores y contactos asociados a pedidos.</p>
        </div>
        {hasAdminPermission(session.role, "users.manage") ? (
          <div className="rounded-[1.5rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Usuarios admin</p>
            <p className="mt-3 font-serif text-4xl text-brand-900">{stats.adminUserCount}</p>
            <p className="mt-2 text-sm text-brand-900/64">Cuentas activas con acceso al backoffice.</p>
          </div>
        ) : null}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleModules.map((module) => (
          <Link key={module.title} href={module.href} className="rounded-[1.7rem] border border-brand-900/10 bg-paper p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-900/20 hover:shadow-[0_24px_60px_rgba(16,28,48,0.1)]">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Modulo</p>
            <h2 className="mt-3 font-serif text-2xl text-brand-900">{module.title}</h2>
            <p className="mt-4 text-sm leading-7 text-brand-900/68">{module.note}</p>
            <p className="mt-5 ui-label text-[11px] text-brand-700">Abrir modulo</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
