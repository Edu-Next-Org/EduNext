import { cookies } from "next/headers";

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: string[];
  profileImage: string | null;
  profileImagePublicId: string | null;
  isVerified: boolean;
  about: string;
  birthday: string | null;
  gender: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  status: string;
  data: {
    user: UserProfile;
  };
}

export async function getUserInfoAdmin(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const response = await fetch(`${baseUrl}/user-panel/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result: ProfileResponse = await response.json();
    return result.data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
