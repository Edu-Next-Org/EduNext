export const revalidate = 60;

import { CommentsManagement } from "@/modules/admin/components/comments-management/comments-management";
import { getCommentsManagementData } from "@/modules/admin/data/mock";

export default async function Page() {
  const data = await getCommentsManagementData();

  return <CommentsManagement comments={data.comments} />;
}
