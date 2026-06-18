import api from "@/core/services/api";

interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

export async function deleteCourse(courseId: string) {
  const { data } = await api.delete<DeleteCourseResponse>(
    `/courses/${courseId}`,
  );
  return data;
}
