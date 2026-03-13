import type { AdminRole } from "@prisma/client";

import { adminRoleLabels } from "@/lib/admin-permissions";

const roleTones: Record<AdminRole, string> = {
  SUPER_ADMIN: "bg-brand-900 text-white",
  ADMIN_COMERCIAL: "bg-brand-700/10 text-brand-900",
  OPERACIONES: "bg-blue-50 text-blue-800",
  EDITOR_CONTENIDO: "bg-amber-50 text-amber-800",
  SOLO_LECTURA: "bg-slate-100 text-slate-700",
};

export function RoleBadge({ role }: { role: AdminRole }) {
  return <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${roleTones[role]}`}>{adminRoleLabels[role]}</span>;
}
