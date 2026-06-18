import api from "@/core/services/api";

export interface CommentUser {
  _id: string;
  name?: string;
  profileImage: string | null;
}

export interface CommentData {
  _id: string;
  course: string;
  user: CommentUser;
  content: string;
  isConfirmed: boolean;
  createdAt: string;
  __v?: number;
}

export interface CommentsResponse {
  success: boolean;
  data: CommentData[];
}

export const getCourseComments = async (
  courseId: string,
): Promise<CommentData[]> => {
  try {
    const response = await api.get<CommentsResponse>(`/comments/${courseId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch course comments");
  }
};
