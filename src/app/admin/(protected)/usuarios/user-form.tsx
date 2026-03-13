import { AdminRole } from "@prisma/client";

import { RoleBadge } from "@/components/admin/role-badge";
import { adminRoleLabels } from "@/lib/admin-permissions";

import { saveAdminUserAction } from "@/app/admin/usuarios/actions";

type AdminUserFormData = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
};

const roleOptions: AdminRole[] = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN_COMERCIAL,
  AdminRole.OPERACIONES,
  AdminRole.EDITOR_CONTENIDO,
  AdminRole.SOLO_LECTURA,
];

export function AdminUserForm({ user }: { user?: AdminUserFormData | null }) {
  return (
    <form action={saveAdminUserAction} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <input type="hidden" name="userId" value={user?.id ?? ""} />

      <section className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Datos de acceso</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Nombre" defaultValue={user?.name} className="sm:col-span-2" />
          <Field name="email" type="email" label="Email" defaultValue={user?.email} className="sm:col-span-2" />
          <Field name="password" type="password" label={user ? "Nuevo password (opcional)" : "Password inicial"} />
          <label>
            <span className="mb-2 block text-sm text-brand-900/75">Perfil</span>
            <select name="role" defaultValue={user?.role ?? AdminRole.SOLO_LECTURA} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2">
              {roleOptions.map((role) => (
                <option key={role} value={role}>{adminRoleLabels[role]}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-[1rem] border border-brand-900/10 bg-white px-4 py-3 text-sm text-brand-900 sm:col-span-2">
            <input type="checkbox" name="isActive" defaultChecked={user?.isActive ?? true} />
            Usuario activo
          </label>
        </div>
      </section>

      <div className="space-y-8">
        <section className="rounded-[1.75rem] border border-brand-900/10 bg-paper p-6 shadow-soft">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-brand-900">Perfil operativo</h2>
          <div className="mt-4 space-y-3">
            {roleOptions.map((role) => (
              <div key={role} className="rounded-[1rem] border border-brand-900/10 bg-white px-4 py-4">
                <RoleBadge role={role} />
                <p className="mt-3 text-sm leading-6 text-brand-900/68">{describeRole(role)}</p>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-brand-700">
          {user ? "Guardar usuario" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}

function describeRole(role: AdminRole) {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return "Acceso total al backoffice, incluyendo usuarios y configuracion sensible.";
    case AdminRole.ADMIN_COMERCIAL:
      return "Gestiona catalogo, categorias, pedidos y contenido sin tocar usuarios.";
    case AdminRole.OPERACIONES:
      return "Opera pedidos y seguimiento comercial del flujo de compra.";
    case AdminRole.EDITOR_CONTENIDO:
      return "Edita home y paginas institucionales sin intervenir operacion comercial.";
    case AdminRole.SOLO_LECTURA:
      return "Acceso limitado al dashboard para consulta general.";
  }
}

function Field({ name, label, defaultValue, className, type = "text" }: { name: string; label: string; defaultValue?: string; className?: string; type?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 focus:ring-2" />
    </label>
  );
}
