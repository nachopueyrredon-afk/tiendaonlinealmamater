import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createMercadoPagoPreference } from "@/lib/integrations/mercadopago";

const bodySchema = z.object({
  orderNumber: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ),
  payer: z.object({
    email: z.string().email(),
  }),
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const preference = await createMercadoPagoPreference(parsed.data);

  return NextResponse.json(preference);
}
