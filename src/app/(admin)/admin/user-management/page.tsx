export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { UserManagement } from "@/modules/admin/components/user-management/user-management";
import { getAllUsers } from "@/core/services/api/Get/GetAllUser";

interface PageSearchParams {
  page?: string;
  search?: string;
  role?: string;
  limit?: string;
}

interface PageProps {
  searchParams: Promise<PageSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);
  const search = sp.search?.trim() || undefined;
  const role = sp.role || undefined;

  const data = await getAllUsers({
    page,
    limit,
    search,
    role,
  });

  return (
    <Suspense>
      <UserManagement users={data.users} meta={data.meta} />
    </Suspense>
  );
}
