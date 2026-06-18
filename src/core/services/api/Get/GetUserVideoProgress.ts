import api from "@/core/services/api";

export interface UserVideoProgressData {
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
}

export interface GetProgressResponse {
  success: boolean;
  data: UserVideoProgressData | null;
}

export const GetUserVideoProgress = async (
  courseId: string,
): Promise<GetProgressResponse> => {
  const response = await api.get<GetProgressResponse>(
    `/user-progress/${courseId}`,
  );
  return response.data;
};
