import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export function institutionalPageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/${title.toLowerCase().replaceAll(" ", "-")}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
  };
}
