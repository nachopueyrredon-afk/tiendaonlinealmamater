import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("privacidad");
}

export default async function PrivacyPage() {
  const page = await getSitePageBySlug("privacidad");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
