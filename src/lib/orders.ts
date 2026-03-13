import { PaymentMethod, PaymentStatus, ShipmentStatus, ShippingCarrier, type Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import { z } from "zod";

import type { CartDetailedItem } from "@/types/store";
import { prisma } from "@/lib/prisma";

export const checkoutSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(4),
  shippingMethod: z.enum(["correo", "oca", "retiro"]),
  paymentMethod: z.enum(["mercadopago", "transferencia"]),
  notes: z.string().optional(),
});

function getShippingConfig(method: "correo" | "oca" | "retiro") {
  if (method === "oca") {
    return { carrier: ShippingCarrier.OCA, name: "OCA a domicilio", cost: 6900 };
  }

  if (method === "retiro") {
    return { carrier: ShippingCarrier.PICKUP, name: "Retiro acordado", cost: 0 };
  }

  return { carrier: ShippingCarrier.CORREO_ARGENTINO, name: "Correo Argentino a domicilio", cost: 6400 };
}

export async function createOrderFromCheckout(input: z.infer<typeof checkoutSchema>, cartItems: CartDetailedItem[]) {
  const payload = checkoutSchema.parse(input);

  if (cartItems.length === 0) {
    throw new Error("El carrito esta vacio");
  }

  const shipping = getShippingConfig(payload.shippingMethod);
  const paymentMethod = payload.paymentMethod === "mercadopago" ? PaymentMethod.MERCADO_PAGO : PaymentMethod.BANK_TRANSFER;
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (paymentMethod === PaymentMethod.BANK_TRANSFER ? item.lineTransferTotal : item.lineRegularTotal),
    0
  );
  const transferSavings = cartItems.reduce((sum, item) => sum + (item.lineRegularTotal - item.lineTransferTotal), 0);
  const orderNumber = `AM-${nanoid(8).toUpperCase()}`;

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email: payload.email },
      update: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
      },
      create: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
      },
    });

    const address = await tx.address.create({
      data: {
        customerId: customer.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        line1: payload.line1,
        line2: payload.line2,
        city: payload.city,
        province: payload.province,
        postalCode: payload.postalCode,
        phone: payload.phone,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        email: payload.email,
        paymentMethod,
        paymentStatus: paymentMethod === PaymentMethod.BANK_TRANSFER ? PaymentStatus.MANUAL_REVIEW : PaymentStatus.PENDING,
        shippingStatus: ShipmentStatus.QUOTED,
        billingAddressId: address.id,
        shippingAddressId: address.id,
        subtotal,
        shippingTotal: shipping.cost,
        total: subtotal + shipping.cost,
        transferSavings,
        notes: payload.notes,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productNameSnapshot: item.productName,
            variantNameSnapshot: item.variantName,
            skuSnapshot: item.sku,
            quantity: item.quantity,
            unitRegularPrice: item.regularPrice,
            unitTransferPrice: item.transferPrice,
            lineTotal: paymentMethod === PaymentMethod.BANK_TRANSFER ? item.lineTransferTotal : item.lineRegularTotal,
          })),
        },
        payments: {
          create: {
            provider: paymentMethod === PaymentMethod.MERCADO_PAGO ? "mercadopago" : "bank-transfer",
            method: paymentMethod,
            status: paymentMethod === PaymentMethod.MERCADO_PAGO ? PaymentStatus.PENDING : PaymentStatus.MANUAL_REVIEW,
            amount: subtotal + shipping.cost,
            metadata: {
              source: "checkout",
            } as Prisma.JsonObject,
          },
        },
        shipments: {
          create: {
            carrier: shipping.carrier,
            serviceName: shipping.name,
            cost: shipping.cost,
            postalCode: payload.postalCode,
            status: ShipmentStatus.QUOTED,
          },
        },
      },
      include: {
        items: true,
        payments: true,
        shipments: true,
      },
    });

    for (const item of cartItems) {
      if (!item.variantId) continue;

      if (item.availableStock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.productName}`);
      }

      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  }, {
    maxWait: 20000,
    timeout: 20000,
  });
}
