import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("cambios-y-devoluciones");
}

export default async function ReturnsPage() {
  const page = await getSitePageBySlug("cambios-y-devoluciones");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
