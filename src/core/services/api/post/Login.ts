// import axios from "axios";
// import { setAccessToken } from "@/core/services/token.service";

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface User {
//   id: string;
//   email: string;
//   role: string;
// }

// export interface LoginResponseData {
//   accessToken: string;
//   user: User;
// }

// export interface LoginResponse {
//   success: boolean;
//   data: LoginResponseData;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const loginUser = async (
//   values: LoginPayload
// ): Promise<LoginResponse> => {
//   const response = await axios.post<LoginResponse>(
//     `${API_URL}/auth/login`,
//     values,
//     { withCredentials: true } 
//   );


//   const accessToken = response.data?.data?.accessToken;
//   if (accessToken) {
//     setAccessToken(accessToken); 
//   }

//   return response.data;
// };

import api from "@/core/services/api";
import { setAccessToken } from "@/core/services/token.service";

export interface LoginPayload { email: string; password: string; }
export interface User { id: string; email: string; role: string; }
export interface LoginResponseData { accessToken: string; user: User; }
export interface LoginResponse { success: boolean; data: LoginResponseData; }

export const loginUser = async (values: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", values);

  const accessToken = response.data?.data?.accessToken;
  if (accessToken) {
    setAccessToken(accessToken); 
  }

  return response.data;
};