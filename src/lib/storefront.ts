import { ProductLine, ProductStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { StoreProduct } from "@/types/store";

const productInclude = {
  images: {
    orderBy: { sortOrder: "asc" },
  },
  variants: {
    orderBy: [{ sortOrder: "asc" }],
    include: {
      material: true,
      devotion: true,
    },
  },
  categories: {
    include: { category: true },
  },
  collections: {
    include: { collection: true },
  },
  materials: {
    include: { material: true },
  },
  devotions: {
    include: { devotion: true },
  },
} satisfies Prisma.ProductInclude;

type ProductRecord = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function fallbackImages(product: ProductRecord) {
  if (product.images.length > 0) {
    return product.images.map((image) => ({
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
    }));
  }

  return [
    {
      url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
      alt: product.name,
      isPrimary: true,
    },
  ];
}

function mapProduct(product: ProductRecord): StoreProduct {
  const totalVariantStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const stock = product.variants.length > 0 ? totalVariantStock : product.baseStock;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle ?? undefined,
    description: product.description,
    line: product.line,
    sku: product.sku,
    regularPrice: product.regularPrice,
    transferPrice: product.transferPrice,
    stock,
    installmentsText: product.installmentsText ?? undefined,
    dimensions: product.dimensions ?? undefined,
    weightGrams: product.weightGrams ?? undefined,
    careInstructions: product.careInstructions ?? undefined,
    categories: product.categories.map((entry) => entry.category.name),
    collections: product.collections.map((entry) => entry.collection.name),
    materials: product.materials.map((entry) => entry.material.name),
    devotions: product.devotions.map((entry) => entry.devotion.name),
    featured: product.isFeatured,
    tags: [
      ...(product.isFeatured ? ["destacado"] : []),
      ...(product.createdAt >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 45) ? ["nuevo"] : []),
      ...(stock === 0 ? ["sin stock"] : []),
      ...(product.transferPrice < product.regularPrice ? ["descuento transferencia"] : []),
    ],
    images: fallbackImages(product),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      sku: variant.sku,
      regularPrice: variant.regularPrice,
      transferPrice: variant.transferPrice,
      stock: variant.stock,
      material: variant.material?.name,
      devotion: variant.devotion?.name,
      sizeLabel: variant.sizeLabel ?? undefined,
      finishLabel: variant.finishLabel ?? undefined,
      isDefault: variant.isDefault,
    })),
  };
}

export async function getPublishedProducts() {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED },
    include: productInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products.map(mapProduct);
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED, isFeatured: true },
    include: productInclude,
    orderBy: [{ createdAt: "desc" }],
    take: limit,
  });

  return products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });

  if (!product || product.status !== ProductStatus.PUBLISHED) {
    return null;
  }

  return mapProduct(product);
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const product = await getProductBySlug(slug);
  if (!product) return [];

  const allProducts = await getPublishedProducts();

  return allProducts
    .filter(
      (item) =>
        item.slug !== slug &&
        (item.line === product.line || item.collections.some((collection) => product.collections.includes(collection)))
    )
    .slice(0, limit);
}

export async function filterProducts(params: {
  q?: string;
  categoria?: string;
  linea?: string;
  advocacion?: string;
  material?: string;
  precio?: string;
  stock?: string;
}) {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
  };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { collections: { some: { collection: { name: { contains: params.q, mode: "insensitive" } } } } },
    ];
  }

  if (params.categoria) {
    where.categories = { some: { category: { name: params.categoria } } };
  }

  if (params.linea && Object.values(ProductLine).includes(params.linea as ProductLine)) {
    where.line = params.linea as ProductLine;
  }

  if (params.advocacion) {
    where.devotions = { some: { devotion: { name: params.advocacion } } };
  }

  if (params.material) {
    where.OR = [
      ...(where.OR ?? []),
      { materials: { some: { material: { name: params.material } } } },
      { variants: { some: { material: { name: params.material } } } },
    ];
  }

  if (params.precio === "0-90000") {
    where.transferPrice = { lte: 90000 };
  }

  if (params.precio === "90000-150000") {
    where.transferPrice = { gt: 90000, lte: 150000 };
  }

  if (params.precio === "150000+") {
    where.transferPrice = { gt: 150000 };
  }

  if (params.stock === "disponible") {
    where.OR = [
      ...(where.OR ?? []),
      { variants: { some: { stock: { gt: 0 } } } },
      { AND: [{ variants: { none: {} } }, { baseStock: { gt: 0 } }] },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products.map(mapProduct);
}

export async function getCatalogFilters() {
  const [categories, collections, materials, devotions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
    prisma.devotion.findMany({ orderBy: { name: "asc" } }),
  ]);

  return {
    categories,
    collections,
    materials: materials.map((item) => item.name),
    devotions: devotions.map((item) => item.name),
    priceRanges: [
      { label: "Hasta $90.000", min: 0, max: 90000 },
      { label: "$90.000 - $150.000", min: 90000, max: 150000 },
      { label: "$150.000+", min: 150000 },
    ],
  };
}

export async function getCollections() {
  return prisma.collection.findMany({ orderBy: [{ isFeatured: "desc" }, { name: "asc" }] });
}

export async function getHomeBlocks() {
  return prisma.homeBlock.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
}

export async function getHomeBlockByKey(key: string) {
  return prisma.homeBlock.findUnique({ where: { key } });
}
