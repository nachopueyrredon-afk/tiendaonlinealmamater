import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("faq");
}

export default async function FaqPage() {
  const page = await getSitePageBySlug("faq");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
