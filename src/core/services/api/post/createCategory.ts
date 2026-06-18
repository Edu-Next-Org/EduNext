import api from "@/core/services/api";
import { isAxiosError } from "axios";

export interface CreateCategoryResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export async function createCategory(
  name: string,
): Promise<CreateCategoryResponse> {
  try {
    const response = await api.post<CreateCategoryResponse>("/categories", {
      name,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create category");
  }
}
