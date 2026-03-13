import type { AdminRole } from "@prisma/client";

export type AdminPermission =
  | "dashboard.view"
  | "products.manage"
  | "taxonomy.manage"
  | "orders.manage"
  | "content.manage"
  | "users.manage";

export const adminRoleLabels: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_COMERCIAL: "Admin Comercial",
  OPERACIONES: "Operaciones",
  EDITOR_CONTENIDO: "Editor de Contenido",
  SOLO_LECTURA: "Solo Lectura",
};

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: ["dashboard.view", "products.manage", "taxonomy.manage", "orders.manage", "content.manage", "users.manage"],
  ADMIN_COMERCIAL: ["dashboard.view", "products.manage", "taxonomy.manage", "orders.manage", "content.manage"],
  OPERACIONES: ["dashboard.view", "orders.manage"],
  EDITOR_CONTENIDO: ["dashboard.view", "content.manage"],
  SOLO_LECTURA: ["dashboard.view"],
};

export function hasAdminPermission(role: AdminRole, permission: AdminPermission) {
  return rolePermissions[role].includes(permission);
}
