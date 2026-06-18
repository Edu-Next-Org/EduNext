"use server";

import api from "@/core/services/api";
import { cookies } from "next/headers";

export interface CommentData {
  course: string;
  user: string;
  content: string;
  isConfirmed: boolean;
  _id: string;
  createdAt: string;
  __v: number;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: CommentData;
}

export interface CommentPayload {
  courseId: string;
  content: string;
}

export async function addCourseComment({
  courseId,
  content,
}: CommentPayload): Promise<CommentResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const response = await api.post<CommentResponse>(
      `/comments/${courseId}`,
      { content },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    return response.data;
  } catch (error: unknown) {
    import("axios").then(({ isAxiosError }) => {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to submit comment. Please try again.",
        );
      }
    });

    throw new Error(
      "An unexpected error occurred while submitting the comment.",
    );
  }
}
