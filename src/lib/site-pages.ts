import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export async function getSitePages() {
  return prisma.sitePage.findMany({ orderBy: { title: "asc" } });
}

export async function getSitePageBySlug(slug: string) {
  return prisma.sitePage.findUnique({ where: { slug } });
}

export async function getSitePageMetadata(slug: string): Promise<Metadata> {
  const page = await getSitePageBySlug(slug);
  if (!page) {
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.body.slice(0, 160),
    openGraph: {
      title: `${page.seoTitle || page.title} | ${siteConfig.name}`,
      description: page.seoDescription || page.body.slice(0, 160),
      url: `${siteConfig.url}/${page.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
  };
}
