import api from "../../api";

export interface ExamCourseData {
  _id: string;
  title: string;
  description: string;
  courseImage: string;
  courseVideo: string;
}

export interface ExamData {
  _id: string;
  course: ExamCourseData;
  title: string;
  passingScore: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetExamResponse {
  success: boolean;
  data: ExamData | null;
}

export const GetExamByCourse = async (courseId: string): Promise<ExamData> => {
  const response = await api.get<GetExamResponse>(`/exams/course/${courseId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error("Exam not found for this course.");
  }

  return response.data.data;
};
