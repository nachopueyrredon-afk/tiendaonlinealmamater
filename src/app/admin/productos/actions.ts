"use server";

import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

import { OrderStatus, PaymentStatus, ProductLine, ProductStatus, ShipmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function buildRedirectPath(pathname: string, feedback: string) {
  return `${pathname}?feedback=${feedback}`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueProductField(field: "slug" | "sku", value: string, excludeProductId?: string) {
  let candidate = value;
  let attempt = 1;

  while (true) {
    const product = await prisma.product.findFirst({
      where: {
        [field]: candidate,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
      select: { id: true },
    });

    if (!product) {
      return candidate;
    }

    attempt += 1;
    candidate = field === "slug" ? `${value}-${attempt}` : `${value}-${attempt}`;
  }
}

function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");

  if (slug) {
    revalidatePath(`/producto/${slug}`);
  }
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

  const baseSlug = String(formData.get("slug") || "").trim() || slugify(name);
  const line = String(formData.get("line") || "RESINA_EPOXI") as ProductLine;
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;
  const regularPrice = Number(formData.get("regularPrice") || 0);
  const transferPrice = Number(formData.get("transferPrice") || 0);
  const baseStock = Math.max(0, Number(formData.get("baseStock") || 0));
  const subtitle = String(formData.get("subtitle") || "").trim() || null;
  const installmentsText = String(formData.get("installmentsText") || "").trim() || null;
  const dimensions = String(formData.get("dimensions") || "").trim() || null;
  const weightGrams = Number(formData.get("weightGrams") || 0) || null;
  const careInstructions = String(formData.get("careInstructions") || "").trim() || null;
  const categoryIds = parseCategoryIds(formData);
  const images = parseImageLines(String(formData.get("images") || ""));
  const uploadedImages = await parseUploadedImages(formData);
  const isFeatured = String(formData.get("isFeatured") || "") === "on";
  const slug = await ensureUniqueProductField("slug", baseSlug, productId || undefined);
  const uniqueSku = await ensureUniqueProductField("sku", sku, productId || undefined);

  const data = {
    name,
    slug,
    subtitle,
    description,
    line,
    status,
    sku: uniqueSku,
    regularPrice,
    transferPrice,
    baseStock,
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

  revalidateProductPaths(product.slug);
  redirect(buildRedirectPath("/admin/productos", "product-saved"));
}

export async function setProductStatusAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");
  const status = String(formData.get("status") || "DRAFT") as ProductStatus;

  if (!productId) {
    throw new Error("Falta el producto a actualizar.");
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { status },
    select: { slug: true },
  });

  revalidateProductPaths(product.slug);
  redirect(buildRedirectPath("/admin/productos", "product-status-updated"));
}

export async function duplicateProductAction(formData: FormData) {
  const productId = String(formData.get("productId") || "");

  if (!productId) {
    throw new Error("Falta el producto a duplicar.");
  }

  const source = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
      collections: true,
      materials: true,
      devotions: true,
      attributes: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!source) {
    throw new Error("No se encontro el producto a duplicar.");
  }

  const duplicateSlug = await ensureUniqueProductField("slug", `${source.slug}-copia`);
  const duplicateSku = await ensureUniqueProductField("sku", `${source.sku}-COPY`);

  const duplicated = await prisma.product.create({
    data: {
      name: `${source.name} copia`,
      slug: duplicateSlug,
      subtitle: source.subtitle,
      description: source.description,
      line: source.line,
      status: ProductStatus.DRAFT,
      sku: duplicateSku,
      regularPrice: source.regularPrice,
      transferPrice: source.transferPrice,
      baseStock: source.baseStock,
      compareAtPrice: source.compareAtPrice,
      installmentsText: source.installmentsText,
      dimensions: source.dimensions,
      weightGrams: source.weightGrams,
      careInstructions: source.careInstructions,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      isFeatured: false,
      inventoryPolicy: source.inventoryPolicy,
      categories: {
        create: source.categories.map((entry) => ({ categoryId: entry.categoryId })),
      },
      collections: {
        create: source.collections.map((entry) => ({ collectionId: entry.collectionId })),
      },
      materials: {
        create: source.materials.map((entry) => ({ materialId: entry.materialId })),
      },
      devotions: {
        create: source.devotions.map((entry) => ({ devotionId: entry.devotionId })),
      },
      attributes: {
        create: source.attributes.map((attribute) => ({
          definitionId: attribute.definitionId,
          value: attribute.value,
        })),
      },
      images: {
        create: source.images.map((image) => ({
          url: image.url,
          alt: image.alt,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        })),
      },
      variants: {
        create: source.variants.map((variant, index) => ({
          name: variant.name,
          sku: `${duplicateSku}-V${index + 1}`,
          materialId: variant.materialId,
          devotionId: variant.devotionId,
          sizeLabel: variant.sizeLabel,
          finishLabel: variant.finishLabel,
          regularPrice: variant.regularPrice,
          transferPrice: variant.transferPrice,
          stock: variant.stock,
          sortOrder: variant.sortOrder,
          isDefault: variant.isDefault,
        })),
      },
    },
    select: { id: true, slug: true },
  });

  revalidateProductPaths(duplicated.slug);
  redirect(`/admin/productos/${duplicated.id}?feedback=product-duplicated`);
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
  redirect(buildRedirectPath("/admin/pedidos", "order-updated"));
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
  revalidatePath("/admin/categorias");
  redirect(buildRedirectPath("/admin/categorias", "category-created"));
}

export async function updateCategoryAction(formData: FormData) {
  const categoryId = String(formData.get("categoryId") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;

  if (!categoryId || !name) {
    throw new Error("Categoria y nombre son obligatorios.");
  }

  const current = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!current) {
    throw new Error("No se encontro la categoria a editar.");
  }

  const nextSlug = current.name === name ? current.slug : slugify(name);

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      slug: nextSlug,
      description,
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/admin/categorias");
  redirect(buildRedirectPath("/admin/categorias", "category-updated"));
}
