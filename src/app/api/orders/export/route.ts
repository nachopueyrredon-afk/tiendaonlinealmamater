import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const csv = [
    "orderNumber,customer,total,status,paymentStatus,shippingStatus",
    ...orders.map((order) =>
      [
        order.orderNumber,
        order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : order.email,
        order.total,
        order.status,
        order.paymentStatus,
        order.shippingStatus,
      ].join(",")
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders.csv"',
    },
  });
}
