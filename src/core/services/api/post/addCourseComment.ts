import api from "@/core/services/api";

interface CommentPayload {
  courseId: string;
  content: string;
}

export const addCourseComment = async ({ courseId, content }: CommentPayload) => {

  const response = await api.post(`/comments/${courseId}`, { content });
  return response.data;
};
