import axios from "axios";
import api from "@/core/services/api";

export interface CreateUserPayload {
  name: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  gender?: string | null;
  birthday?: string | null;
  about?: string | null;
  profileImage?: File | null;
}

export interface CreateUserResponse {
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

export async function createUser(
  payload: CreateUserPayload,
): Promise<CreateUserResponse> {
  try {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);

    if (payload.phoneNumber)
      formData.append("phoneNumber", payload.phoneNumber);
    if (payload.gender) formData.append("gender", payload.gender);
    if (payload.birthday) formData.append("birthday", payload.birthday);
    if (payload.about) formData.append("about", payload.about);
    if (payload.profileImage) {
      formData.append("profileImage", payload.profileImage);
    }

    const { data } = await api.post<CreateUserResponse>("/users", formData);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
