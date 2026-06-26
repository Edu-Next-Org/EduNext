import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  success?: boolean;
}

export const deleteCommentAdmin = async (
  commentId: string,
): Promise<DeleteCommentResponse> => {
  try {
    const response = await api.delete<DeleteCommentResponse>(
      `/comments/admin/${commentId}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete comment";

      throw new Error(errorMessage);
    }

    throw new Error("An unexpected error occurred");
  }
};
