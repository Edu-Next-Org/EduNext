import api from "@/core/services/api";

export interface CourseProgressItem {
  _id: string;
  course: string;
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
}

export interface UserByIdApiData {
  _id: string;
  name: string;
  email: string;
  role: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  about: string | null;
  birthday: string | null;
  gender: string | null;
  phoneNumber: string | null;
  profileImage: string | null;
  profileImagePublicId: string | null;
  purchasedCourses: string[];
  courseProgress: CourseProgressItem[];
}

interface GetUserByIdResponse {
  success: boolean;
  data: UserByIdApiData;
}

export async function getUserById(id: string) {
  const { data } = await api.get<GetUserByIdResponse>(`/users/${id}`);

  return data.data;
}
