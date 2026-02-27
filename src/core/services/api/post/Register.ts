// import axios from "axios";

// export interface RegisterPayload {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface RegisteredUser {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface RegisterResponseData {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface RegisterResponse {
//   success: boolean;
//   data: RegisterResponseData;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const registerUser = async (
//   values: RegisterPayload
// ): Promise<RegisterResponse> => {
//   const response = await axios.post<RegisterResponse>(
//     `${API_URL}/auth/register`,
//     values
//   );

//   return response.data;
// };
import api from "@/core/services/api";

export interface RegisterPayload { name: string; email: string; password: string; }
export interface RegisteredUser { id: string; name: string; email: string; role: string; }
export interface RegisterResponseData { id: string; name: string; email: string; role: string; }
export interface RegisterResponse { success: boolean; data: RegisterResponseData; }

export const registerUser = async (values: RegisterPayload): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", values);
  return response.data;
};