"use server";

import { redirect } from "next/navigation";

import { createAdminSession } from "@/lib/admin-session";

export async function adminLoginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const result = await createAdminSession(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect("/admin");
}

export async function adminLogoutAction() {
  const { clearAdminSession } = await import("@/lib/admin-session");
  await clearAdminSession();
  redirect("/admin/login");
}
