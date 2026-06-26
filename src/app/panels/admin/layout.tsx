import type { ReactNode } from "react";
import { AdminShell } from "@/modules/panels/admin/components/admin-shell";
import { getUserInfoAdmin } from "@/core/services/api/Get/GetUserInfoAdmin";

export const metadata = {
  title: "Admin",
  description: "EduNext admin panel",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUserInfoAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}
