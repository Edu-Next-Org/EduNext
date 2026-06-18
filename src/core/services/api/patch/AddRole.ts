import axios from "axios";
import api from "@/core/services/api";

export async function addRole(userId: string, role: string) {
  try {
    const { data } = await api.patch(`/users/${userId}/role/add`, {
      role,
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to add role");
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add role",
      );
    }

    throw error;
  }
}
