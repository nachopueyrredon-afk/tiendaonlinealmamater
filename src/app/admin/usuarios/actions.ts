"use server";

import bcrypt from "bcryptjs";
import { AdminRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPermission } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

function buildRedirectPath(pathname: string, feedback: string) {
  return `${pathname}?feedback=${feedback}`;
}

export async function saveAdminUserAction(formData: FormData) {
  await requireAdminPermission("users.manage");

  const userId = String(formData.get("userId") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const role = String(formData.get("role") || AdminRole.SOLO_LECTURA) as AdminRole;
  const isActive = String(formData.get("isActive") || "") === "on";

  if (!name || !email) {
    throw new Error("Nombre y email son obligatorios.");
  }

  if (!userId && password.length < 6) {
    throw new Error("El password inicial debe tener al menos 6 caracteres.");
  }

  const data = {
    name,
    email,
    role,
    isActive,
  };

  if (userId) {
    await prisma.adminUser.update({
      where: { id: userId },
      data: {
        ...data,
        ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    redirect(buildRedirectPath("/admin/usuarios", "admin-user-updated"));
  }

  await prisma.adminUser.create({
    data: {
      ...data,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  redirect(buildRedirectPath("/admin/usuarios", "admin-user-created"));
}
