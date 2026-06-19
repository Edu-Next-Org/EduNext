import type { ReactNode } from "react";
import { AdminShell } from "@/modules/panels/admin/components/admin-shell";

export const metadata = {
  title: "EduNext | Admin",
  description: "EduNext admin panel",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
