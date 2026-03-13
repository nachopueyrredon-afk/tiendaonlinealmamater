import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { quoteShipping } from "@/lib/integrations/shipping";

const bodySchema = z.object({
  postalCode: z.string().min(4),
  items: z.array(
    z.object({
      sku: z.string().min(1),
      quantity: z.number().int().positive(),
      weightGrams: z.number().int().positive().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const quotes = await quoteShipping(parsed.data);

  return NextResponse.json({ quotes });
}
