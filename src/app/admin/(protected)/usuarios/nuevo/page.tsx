import Link from "next/link";

import { requireAdminPermission } from "@/lib/admin-session";

import { AdminUserForm } from "../user-form";

export default async function AdminNewUserPage() {
  await requireAdminPermission("users.manage");

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Usuarios</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Nuevo usuario</h1>
        </div>
        <Link href="/admin/usuarios" className="text-sm text-brand-700">Volver al listado</Link>
      </div>
      <AdminUserForm />
    </section>
  );
}
