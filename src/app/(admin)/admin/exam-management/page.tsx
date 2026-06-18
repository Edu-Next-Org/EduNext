export const revalidate = 60;

import { ExamManagement } from "@/modules/admin/components/exam-management/exam-management";

export default async function Page() {
  return <ExamManagement />;
}
