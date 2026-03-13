import { requireAdminSession } from "@/lib/admin-session";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return <>{children}</>;
}
