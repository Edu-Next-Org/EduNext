"use server";

import api from "@/core/services/api";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

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

export interface IDecodedToken {
  id: string;
  role: string[];
  exp: number;
  iat: number;
}

export interface LoginResponse {
  success: boolean;
  data?: LoginResponseData;
  message?: string;
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
    let errorMessage = "Failed to login";

    if (error instanceof AxiosError) {
      if (error.response?.status === 500) {
        errorMessage = "Failed to login";
      } else {
        const backendData = error.response?.data as
          | { message?: string }
          | undefined;
        if (backendData?.message) {
          errorMessage = backendData.message;
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
