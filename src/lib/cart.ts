import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import type { CartDetailedItem, CartItem } from "@/types/store";

const CART_COOKIE = "almamater-cart";

function normalizeCartItems(items: CartItem[]) {
  const grouped = new Map<string, CartItem>();

  for (const item of items) {
    if (!item.productSlug || item.quantity <= 0) continue;

    const key = `${item.productSlug}:${item.variantId ?? "base"}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.quantity += item.quantity;
      continue;
    }

    grouped.set(key, {
      productSlug: item.productSlug,
      variantId: item.variantId,
      quantity: Math.min(item.quantity, 10),
    });
  }

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    quantity: Math.max(1, Math.min(item.quantity, 10)),
  }));
}

export async function readCartItems(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return normalizeCartItems(parsed);
  } catch {
    return [];
  }
}

async function writeCartItems(items: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, JSON.stringify(normalizeCartItems(items)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function addCartItem(item: CartItem) {
  const items = await readCartItems();
  items.push(item);
  await writeCartItems(items);
}

export async function updateCartItem(item: CartItem) {
  const items = await readCartItems();
  const updated = items.map((entry) =>
    entry.productSlug === item.productSlug && (entry.variantId ?? undefined) === (item.variantId ?? undefined)
      ? item
      : entry
  );
  await writeCartItems(updated.filter((entry) => entry.quantity > 0));
}

export async function removeCartItem(productSlug: string, variantId?: string) {
  const items = await readCartItems();
  await writeCartItems(
    items.filter((entry) => !(entry.productSlug === productSlug && (entry.variantId ?? undefined) === (variantId ?? undefined)))
  );
}

export async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE);
}

export async function getCartDetail(): Promise<{ items: CartDetailedItem[]; count: number; subtotalRegular: number; subtotalTransfer: number }> {
  const rawItems = await readCartItems();
  if (rawItems.length === 0) {
    return { items: [], count: 0, subtotalRegular: 0, subtotalTransfer: 0 };
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: rawItems.map((item) => item.productSlug) } },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { include: { material: true, devotion: true } },
    },
  });

  const items: CartDetailedItem[] = rawItems.flatMap((line) => {
    const product = products.find((entry) => entry.slug === line.productSlug);
    if (!product) return [];

    const variant = line.variantId ? product.variants.find((entry) => entry.id === line.variantId) : product.variants.find((entry) => entry.isDefault);
    const regularPrice = variant?.regularPrice ?? product.regularPrice;
    const transferPrice = variant?.transferPrice ?? product.transferPrice;
    const availableStock = variant?.stock ?? product.baseStock;
    const quantity = Math.min(line.quantity, Math.max(availableStock, 0));

    if (quantity <= 0) {
      return [];
    }

    return [{
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      imageUrl: product.images[0]?.url ?? "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
      imageAlt: product.images[0]?.alt ?? product.name,
      sku: variant?.sku ?? product.sku,
      variantId: variant?.id,
      variantName: variant?.name,
      quantity,
      regularPrice,
      transferPrice,
      availableStock,
      lineRegularTotal: regularPrice * quantity,
      lineTransferTotal: transferPrice * quantity,
    }];
  });

  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalRegular: items.reduce((sum, item) => sum + item.lineRegularTotal, 0),
    subtotalTransfer: items.reduce((sum, item) => sum + item.lineTransferTotal, 0),
  };
}
