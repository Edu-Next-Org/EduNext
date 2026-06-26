import api from "@/core/services/api";
import { AxiosError } from "axios";
import { QuestionInput } from "../post/CreateQuestion";

export type UpdateQuestionPayload = QuestionInput;

export interface UpdatedQuestionData {
  _id: string;
  exam: string;
  text: string;
  options: string[];
  correctAnswer: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateQuestionResponse {
  success: boolean;
  data: UpdatedQuestionData;
}

export const updateQuestionAdmin = async (
  questionId: string,
  payload: UpdateQuestionPayload,
): Promise<UpdateQuestionResponse> => {
  try {
    const response = await api.put<UpdateQuestionResponse>(
      `/questions/${questionId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update question",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
