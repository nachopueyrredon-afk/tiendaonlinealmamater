"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function saveHomeBlockAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim() || null;
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = String(formData.get("isActive") || "") === "on";
  const contentRaw = String(formData.get("content") || "{}");

  let content;
  try {
    content = JSON.parse(contentRaw);
  } catch {
    throw new Error("El JSON del bloque no es valido.");
  }

  await prisma.homeBlock.update({
    where: { id },
    data: { title, subtitle, sortOrder, isActive, content },
  });

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  redirect("/admin/contenido?feedback=home-block-saved");
}

export async function toggleHomeBlockActiveAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const isActive = String(formData.get("isActive") || "") === "true";

  if (!id) {
    throw new Error("Falta el bloque a actualizar.");
  }

  await prisma.homeBlock.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/");
  revalidatePath("/admin/contenido");
  redirect("/admin/contenido?feedback=home-block-toggled");
}
