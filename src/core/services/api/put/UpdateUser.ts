import axios from "axios";
import api from "@/core/services/api";

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phoneNumber?: string | null;
  gender?: string | null;
  birthday?: string | null;
  about?: string | null;
  profileImage?: File | null;
}

export interface UpdateUserResponse {
  success: boolean;
  message?: string;
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return message || "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<UpdateUserResponse> {
  try {
    const formData = new FormData();

    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.email !== undefined) formData.append("email", payload.email);
    if (payload.phoneNumber !== undefined && payload.phoneNumber !== null) {
      formData.append("phoneNumber", payload.phoneNumber);
    }
    if (payload.gender !== undefined && payload.gender !== null) {
      formData.append("gender", payload.gender);
    }
    if (payload.birthday !== undefined && payload.birthday !== null) {
      formData.append("birthday", payload.birthday);
    }
    if (payload.about !== undefined && payload.about !== null) {
      formData.append("about", payload.about);
    }
    if (payload.profileImage) {
      formData.append("profileImage", payload.profileImage);
    }

    const { data } = await api.put<UpdateUserResponse>(
      `/users/${userId}`,
      formData,
    );

    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
