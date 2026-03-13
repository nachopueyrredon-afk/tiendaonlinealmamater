import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("nosotros");
}

export default async function AboutPage() {
  const page = await getSitePageBySlug("nosotros");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
