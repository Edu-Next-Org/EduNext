export const revalidate = 60;

import { CommentsManagement } from "@/modules/panels/admin/components/comments-management/comments-management";
import { getCommentsManagementData } from "@/modules/panels/admin/data/mock";

export default async function Page() {
  const data = await getCommentsManagementData();

  return <CommentsManagement comments={data.comments} />;
}
