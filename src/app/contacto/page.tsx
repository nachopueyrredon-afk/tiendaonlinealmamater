import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("contacto");
}

export default async function ContactPage() {
  const page = await getSitePageBySlug("contacto");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
