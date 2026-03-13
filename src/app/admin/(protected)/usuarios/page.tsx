import Link from "next/link";

import { ActionFeedback } from "@/components/admin/action-feedback";
import { RoleBadge } from "@/components/admin/role-badge";
import { requireAdminPermission } from "@/lib/admin-session";
import { getAdminUsers } from "@/lib/admin";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ feedback?: string }> }) {
  await requireAdminPermission("users.manage");
  const params = await searchParams;
  const users = await getAdminUsers();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Usuarios</p>
          <h1 className="mt-4 font-serif text-5xl text-brand-900">Perfiles y acceso del backoffice</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/usuarios/nuevo" className="inline-flex items-center justify-center rounded-full bg-brand-900 px-4 py-2 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">Nuevo usuario</Link>
          <Link href="/admin" className="text-sm text-brand-700">Volver al panel</Link>
        </div>
      </div>
      <ActionFeedback feedback={params.feedback} />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Usuarios" value={String(users.length)} description="Accesos creados en el backoffice." />
        <MetricCard label="Activos" value={String(users.filter((user) => user.isActive).length)} description="Usuarios que hoy pueden iniciar sesion." />
        <MetricCard label="Perfiles" value={String(new Set(users.map((user) => user.role)).size)} description="Roles presentes en la operacion actual." />
      </div>
      <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-paper shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-900 text-white">
            <tr>
              <th className="px-5 py-4 font-medium">Usuario</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Perfil</th>
              <th className="px-5 py-4 font-medium">Estado</th>
              <th className="px-5 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-brand-900/10">
                <td className="px-5 py-4 text-brand-900">{user.name}</td>
                <td className="px-5 py-4 text-brand-900/72">{user.email}</td>
                <td className="px-5 py-4"><RoleBadge role={user.role} /></td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${user.isActive ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {user.isActive ? "activo" : "inactivo"}
                  </span>
                </td>
                <td className="px-5 py-4"><Link href={`/admin/usuarios/${user.id}`} className="text-brand-700">Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
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
