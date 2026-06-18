import api from "../../api";

export interface QuestionData {
  _id: string;
  exam: string;
  text: string;
  options: string[];
  correctAnswer: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionResponse {
  success: boolean;
  data: QuestionData[];
}

export const GetQuestionsByExam = async (
  examId: string,
): Promise<QuestionData[]> => {
  const response = await api.get<GetQuestionResponse>(
    `/questions/exam/${examId}`,
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch questions.");
  }

  return response.data.data;
};
