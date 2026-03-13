import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("envios");
}

export default async function ShippingPage() {
  const page = await getSitePageBySlug("envios");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
