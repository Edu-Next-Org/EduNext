import api from "@/core/services/api";
import { isAxiosError } from "axios";

export interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
}

export async function deleteCategory(
  id: string,
): Promise<DeleteCategoryResponse> {
  try {
    const response = await api.delete<DeleteCategoryResponse>(
      `/categories/${id}`,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete category");
  }
}
