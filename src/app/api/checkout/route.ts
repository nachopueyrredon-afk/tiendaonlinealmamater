import { NextRequest, NextResponse } from "next/server";

import { clearCart, getCartDetail } from "@/lib/cart";
import { checkoutSchema, createOrderFromCheckout } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const cart = await getCartDetail();
    const order = await createOrderFromCheckout(parsed.data, cart.items);
    await clearCart();

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      total: order.total,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "checkout_failed" },
      { status: 400 }
    );
  }
}
