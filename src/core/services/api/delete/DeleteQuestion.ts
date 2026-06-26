import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface DeleteQuestionResponse {
  success: boolean;
  message: string;
}

export const deleteQuestionAdmin = async (
  questionId: string,
): Promise<DeleteQuestionResponse> => {
  try {
    const response = await api.delete<DeleteQuestionResponse>(
      `/questions/${questionId}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete question";
      throw new Error(errorMessage);
    }
    throw new Error("Something went wrong");
  }
};
