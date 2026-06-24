import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface UpdateExamPayload {
  title: string;
  passingScore: number;
  timeLimit: number;
}

export interface UpdatedExamData {
  _id: string;
  course: string;
  title: string;
  passingScore: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UpdateExamResponse {
  success: boolean;
  data: UpdatedExamData;
}

export const updateExamAdmin = async (
  examId: string,
  payload: UpdateExamPayload,
): Promise<UpdateExamResponse> => {
  try {
    const response = await api.put<UpdateExamResponse>(
      `/exams/${examId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to update exam");
    }
    throw new Error("An unexpected error occurred");
  }
};
