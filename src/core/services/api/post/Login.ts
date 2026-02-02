import axios from "axios";

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
  refreshToken: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  data: LoginResponseData;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const loginUser = async (
  values: LoginPayload
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    values
  );

  return response.data;
};

