import { ExamManagement } from "@/modules/panels/admin/components/exam-management/exam-management";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { getExamAdmin, ApiExam } from "@/core/services/api/Get/GetExamAdmin";
import {
  getQuestionsAdmin,
  ApiQuestion,
} from "@/core/services/api/Get/GetQuestionAdmin";

interface PageProps {
  searchParams: Promise<{ courseId?: string }> | { courseId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  const initialData = await getAllCoursesAdmin({ limit: 200 });

  let serverExam: ApiExam | null = null;
  let serverQuestions: ApiQuestion[] = [];

  if (courseId) {
    serverExam = await getExamAdmin(courseId);
    if (serverExam) {
      serverQuestions = await getQuestionsAdmin(serverExam._id);
    }
  }

  return (
    <ExamManagement
      initialCourses={initialData.courses}
      serverExam={serverExam}
      serverQuestions={serverQuestions}
    />
  );
}
