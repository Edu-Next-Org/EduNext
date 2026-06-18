"use server";

import api from "@/core/services/api";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreateReplyUser {
  _id: string;
  name: string;
  profileImage: string | null;
}

export interface CreateReplyData {
  _id: string;
  comment: string;
  content: string;
  createdAt: string;
  user: CreateReplyUser;
}

export interface CreateReplyResponse {
  success: boolean;
  message: string;
  data: CreateReplyData;
}

export interface CreateReplyPayload {
  commentId: string;
  courseId: string;
  content: string;
}

export async function createCommentReply({
  commentId,
  courseId,
  content,
}: CreateReplyPayload): Promise<CreateReplyResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const response = await api.post<CreateReplyResponse>(
      `/replies/${commentId}`,
      { content },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    revalidatePath(`/coursedetail/${courseId}`);

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ??
          "Failed to submit reply. Please try again.",
      );
    }
    throw new Error("An unexpected error occurred while submitting the reply.");
  }
}
