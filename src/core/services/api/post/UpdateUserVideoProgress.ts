import api from "@/core/services/api";

export interface UpdateProgressPayload {
  courseId: string;
  watchedSeconds: number;
  totalSeconds: number;
}

export interface UpdateProgressResponse {
  success: boolean;
  message: string;
}

export const UpdateUserVideoProgress = async (
  data: UpdateProgressPayload,
): Promise<UpdateProgressResponse> => {
  const response = await api.post<UpdateProgressResponse>(
    "/user-progress",
    data,
  );
  return response.data;
};
