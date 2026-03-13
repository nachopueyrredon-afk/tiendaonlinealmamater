"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function saveSitePageAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const slug = String(formData.get("slug") || "");
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;

  if (!title || !body || !slug) {
    throw new Error("Slug, titulo y cuerpo son obligatorios.");
  }

  await prisma.sitePage.upsert({
    where: { id: id || "__missing__" },
    update: { slug, title, body, seoTitle, seoDescription },
    create: { slug, title, body, seoTitle, seoDescription },
  }).catch(async () => {
    await prisma.sitePage.upsert({
      where: { slug },
      update: { title, body, seoTitle, seoDescription },
      create: { slug, title, body, seoTitle, seoDescription },
    });
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/contenido");
  redirect("/admin/contenido?feedback=site-page-saved");
}
