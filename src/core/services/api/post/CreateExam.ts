import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface CreateExamPayload {
  course: string;
  title: string;
  passingScore: number;
  timeLimit: number;
}

export interface CreateExamResponse {
  success: boolean;
  data: {
    _id: string;
    course: string;
    title: string;
    passingScore: number;
    timeLimit: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export async function createExamAdmin(
  payload: CreateExamPayload,
): Promise<CreateExamResponse> {
  try {
    const response = await api.post<CreateExamResponse>("/exams", payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
    }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      "Failed to create the exam";

    throw new Error(errorMessage);
  }
}
