"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addCartItem, clearCart, removeCartItem, updateCartItem } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productSlug = String(formData.get("productSlug") || "");
  const variantId = String(formData.get("variantId") || "") || undefined;
  const quantity = Number(formData.get("quantity") || 1);

  await addCartItem({ productSlug, variantId, quantity });
  revalidatePath("/");
  revalidatePath("/carrito");
  redirect("/carrito");
}

export async function updateCartItemAction(formData: FormData) {
  const productSlug = String(formData.get("productSlug") || "");
  const variantId = String(formData.get("variantId") || "") || undefined;
  const quantity = Number(formData.get("quantity") || 1);

  await updateCartItem({ productSlug, variantId, quantity });
  revalidatePath("/");
  revalidatePath("/carrito");
}

export async function removeCartItemAction(formData: FormData) {
  const productSlug = String(formData.get("productSlug") || "");
  const variantId = String(formData.get("variantId") || "") || undefined;

  await removeCartItem(productSlug, variantId);
  revalidatePath("/");
  revalidatePath("/carrito");
}

export async function clearCartAction() {
  await clearCart();
  revalidatePath("/");
  revalidatePath("/carrito");
}
