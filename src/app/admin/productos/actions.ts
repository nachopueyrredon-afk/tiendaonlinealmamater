"use server";

import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

import { OrderStatus, PaymentStatus, ProductLine, ProductStatus, ShipmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseImageLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, alt] = line.split("|").map((item) => item.trim());
      return {
        url,
        alt: alt || `Imagen ${index + 1}`,
        sortOrder: index,
        isPrimary: index === 0,
      };
    });
}

function parseCategoryIds(formData: FormData) {
  return formData
    .getAll("categoryIds")
    .map((value) => String(value))
    .filter(Boolean);
}

async function parseUploadedImages(formData: FormData) {
  const files = formData.getAll("imageFiles").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length === 0) return [];

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const uploaded = [] as Array<{ url: string; alt: string }>;

  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, bytes);
    uploaded.push({ url: `/uploads/products/${fileName}`, alt: file.name.replace(/\.[^.]+$/, "") });
  }

  return uploaded;
}

export async function saveProductAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sku = String(formData.get("sku") || "").trim();

  if (!name || !description || !sku) {
    throw new Error("Nombre, descripcion y SKU son obligatorios.");
  }

  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  const line = String(formData.get("line") || "RESINA_EPOXI") as ProductLine;
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const regularPrice = Number(formData.get("regularPrice") || 0);
  const transferPrice = Number(formData.get("transferPrice") || 0);
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const installmentsText = String(formData.get("installmentsText") || "").trim() || null;
  const dimensions = String(formData.get("dimensions") || "").trim() || null;
  const weightGrams = Number(formData.get("weightGrams") || 0) || null;
  const careInstructions = String(formData.get("careInstructions") || "").trim() || null;
  const categoryIds = parseCategoryIds(formData);
  const images = parseImageLines(String(formData.get("images") || ""));
  const uploadedImages = await parseUploadedImages(formData);
  const isFeatured = String(formData.get("isFeatured") || "") === "on";

  const data = {
    name,
    slug,
    subtitle,
    description,
    line,
    status,
    sku,
    regularPrice,
    transferPrice,
    installmentsText,
    dimensions,
    weightGrams,
    careInstructions,
    isFeatured,
  };

  const product = productId
    ? await prisma.product.update({ where: { id: productId }, data })
    : await prisma.product.create({ data });

  await prisma.productCategory.deleteMany({ where: { productId: product.id } });
  if (categoryIds.length > 0) {
    await prisma.productCategory.createMany({
      data: categoryIds.map((categoryId) => ({ productId: product.id, categoryId })),
      skipDuplicates: true,
    });
  }

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  const finalImages = [...images, ...uploadedImages];
  if (finalImages.length > 0) {
    await prisma.productImage.createMany({
      data: finalImages.map((image, index) => ({ ...image, sortOrder: index, isPrimary: index === 0, productId: product.id })),
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath(`/producto/${product.slug}`);
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function updateOrderAction(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "PENDING");
  const paymentStatus = String(formData.get("paymentStatus") || "PENDING");
  const shippingStatus = String(formData.get("shippingStatus") || "PENDING");
  const trackingCode = String(formData.get("trackingCode") || "").trim() || null;

  const shipment = await prisma.shipment.findFirst({ where: { orderId }, orderBy: { createdAt: "asc" } });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      shippingStatus: shippingStatus as ShipmentStatus,
    },
  });

  if (shipment) {
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: shippingStatus as ShipmentStatus,
        trackingCode,
      },
    });
  }

  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos");
}

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;

  if (!name) {
    throw new Error("El nombre de categoria es obligatorio.");
  }

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description,
    },
  });

  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}
