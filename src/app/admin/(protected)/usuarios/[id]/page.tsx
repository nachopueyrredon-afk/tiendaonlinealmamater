import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin-session";
import { getAdminUserById } from "@/lib/admin";

import { AdminUserForm } from "../user-form";

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission("users.manage");
  const { id } = await params;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-brand-700">Admin / Usuarios</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-brand-900">Editar usuario</h1>
        </div>
        <Link href="/admin/usuarios" className="text-sm text-brand-700">Volver al listado</Link>
      </div>
      <AdminUserForm user={user} />
    </section>
  );
}
