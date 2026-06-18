import api from "@/core/services/api";
import { isAxiosError } from "axios";

export interface CreateLevelResponse {
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

export async function createLevel(name: string): Promise<CreateLevelResponse> {
  try {
    const response = await api.post<CreateLevelResponse>("/course-levels", {
      name,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create level");
  }
}
