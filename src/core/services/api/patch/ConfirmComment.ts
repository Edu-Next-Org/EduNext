import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface ConfirmCommentResponse {
  success: boolean;
  message: string;
}

export const confirmCommentAdmin = async (
  commentId: string,
): Promise<ConfirmCommentResponse> => {
  try {
    const response = await api.patch<ConfirmCommentResponse>(
      `/comments/${commentId}/confirm`,
      { status: true },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Failed to confirm comment";

      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
