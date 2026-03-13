import { prisma } from "@/lib/prisma";

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      categories: {
        include: { category: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: true,
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      customer: true,
      payments: true,
      shipments: true,
      items: true,
      shippingAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminUsers() {
  return prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAdminUserById(id: string) {
  return prisma.adminUser.findUnique({ where: { id } });
}

export async function getAdminHomeBlocks() {
  return prisma.homeBlock.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getAdminHomeBlockById(id: string) {
  return prisma.homeBlock.findUnique({ where: { id } });
}

export async function getAdminDashboardStats() {
  const [productCount, orderCount, customerCount, adminUserCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.adminUser.count({ where: { isActive: true } }),
  ]);

  return { productCount, orderCount, customerCount, adminUserCount };
}
