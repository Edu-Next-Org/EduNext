import api from "@/core/services/api";
import { AxiosError } from "axios";
import type { ProfileImageResponse } from "../post/UploadProfileAdmin";

export const deleteProfileImage = async (): Promise<ProfileImageResponse> => {
  try {
    const response = await api.delete<ProfileImageResponse>(
      "/user-panel/profile-image",
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete image",
      );
    }
    throw new Error("An unexpected error occurred while deleting");
  }
};
