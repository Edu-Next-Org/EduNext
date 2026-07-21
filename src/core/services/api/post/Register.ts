"use server";

import api from "@/core/services/api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: RegisterResponseData;
  message?: string;
}

export const registerUser = async (
  values: RegisterPayload,
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/auth/register", values);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const errorMessage =
      err.response?.data?.message || "Registration failed. Please try again.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
