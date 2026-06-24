import api from "@/core/services/api";
import { AxiosError } from "axios";

export interface CourseProgress {
  course: string;
  watchedSeconds: number;
  totalSeconds: number;
  isCompleted: boolean;
  _id: string;
}

export interface UserProfileData {
  _id: string;
  email: string;
  role: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  about: string;
  birthday: string | null;
  gender: string;
  phoneNumber: string;
  name: string;
  passwordResetExpires?: string;
  passwordResetToken?: string;
  purchasedCourses: string[];
  courseProgress: CourseProgress[];
  profileImage: string | null;
  profileImagePublicId: string | null;
}

export interface ProfileImageResponse {
  status: string;
  message: string;
  data: {
    user: UserProfileData;
  };
}

export const uploadProfileImage = async (
  file: File,
): Promise<ProfileImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post<ProfileImageResponse>(
      "/user-panel/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image",
      );
    }
    throw new Error("An unexpected error occurred while uploading");
  }
};
