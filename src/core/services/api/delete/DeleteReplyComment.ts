import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface DeleteReplyResponse {
  success: boolean;
  message: string;
}

export const deleteReplyAdmin = async (
  commentId: string,
  replyId: string,
): Promise<DeleteReplyResponse> => {
  try {
    const response = await api.delete<DeleteReplyResponse>(
      `/replies/admin/${commentId}/${replyId}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete reply";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};
