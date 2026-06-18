"use server";

import api from "@/core/services/api";
import { cookies } from "next/headers";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  data: LoginResponseData;
}

export const loginUser = async (
  values: LoginPayload,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", values);

    const accessToken = response.data?.data?.accessToken;

    const setCookieHeader = response.headers["set-cookie"];

    const cookieStore = await cookies();

    if (accessToken) {
      cookieStore.set("accessToken", accessToken, {
        path: "/",
        maxAge: 15 * 60,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
    }

    if (setCookieHeader && setCookieHeader.length > 0) {
      const refreshTokenCookieString = setCookieHeader.find((str) =>
        str.startsWith("refreshToken="),
      );

      if (refreshTokenCookieString) {
        const refreshTokenMatch =
          refreshTokenCookieString.match(/refreshToken=([^;]+)/);

        if (refreshTokenMatch && refreshTokenMatch[1]) {
          const refreshTokenValue = refreshTokenMatch[1];

          cookieStore.set("refreshToken", refreshTokenValue, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }
      }
    }

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const errorMessage = err.response?.data?.message || "Failed to login";

    throw new Error(errorMessage);
  }
};
