import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface DeleteExamResponse {
  success: boolean;
  message: string;
}

export const deleteExamAdmin = async (
  examId: string,
): Promise<DeleteExamResponse> => {
  try {
    const response = await api.delete<DeleteExamResponse>(`/exams/${examId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete exam";
      throw new Error(errorMessage);
    }
    throw new Error("Something went wrong");
  }
};
