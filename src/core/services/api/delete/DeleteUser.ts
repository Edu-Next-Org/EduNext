import api from "@/core/services/api";

export interface DeleteUserResponse {
  success: boolean;
  message?: string;
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  const { data } = await api.delete<DeleteUserResponse>(`/users/${userId}`);
  return data;
}
