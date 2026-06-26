import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface QuestionInput {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface CreateQuestionPayload {
  examId: string;
  questions: QuestionInput[];
}

export interface CreatedQuestionData {
  _id: string;
  exam: string;
  text: string;
  options: string[];
  correctAnswer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionResponse {
  success: boolean;
  count: number;
  data: CreatedQuestionData[];
}

export const createQuestionAdmin = async (
  payload: CreateQuestionPayload,
): Promise<CreateQuestionResponse> => {
  try {
    const response = await api.post<CreateQuestionResponse>(
      "/questions/bulk",
      payload,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create questions",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
