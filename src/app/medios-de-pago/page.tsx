import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageMetadata, getSitePageBySlug } from "@/lib/site-pages";

export async function generateMetadata() {
  return getSitePageMetadata("medios-de-pago");
}

export default async function PaymentsPage() {
  const page = await getSitePageBySlug("medios-de-pago");
  if (!page) return null;
  return <SitePageView title={page.title} body={page.body} />;
}
