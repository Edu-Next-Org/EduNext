import api from "@/core/services/api";
import { isAxiosError } from "axios";

export interface DeleteLevelResponse {
  success: boolean;
  message?: string;
}

export async function deleteLevel(id: string): Promise<DeleteLevelResponse> {
  try {
    const response = await api.delete<DeleteLevelResponse>(
      `/course-levels/${id}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete level");
  }
}
