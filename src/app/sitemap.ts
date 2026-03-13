import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/catalogo", "/carrito", "/checkout", "/nosotros", "/envios", "/medios-de-pago", "/cambios-y-devoluciones", "/contacto", "/faq", "/privacidad", "/colecciones"];
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/producto/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
