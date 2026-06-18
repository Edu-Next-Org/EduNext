import { cookies } from "next/headers";

interface ApiLevel {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiLevelsResponseBody {
  success: boolean;
  data: ApiLevel[];
}

export interface AdminLevel {
  id: string;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getAllLevelsAdmin(): Promise<AdminLevel[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/course-levels`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `getAllLevelsAdmin failed: ${res.status} ${res.statusText}`,
    );
  }

  const json: ApiLevelsResponseBody = await res.json();

  return json.data.map((item) => ({
    id: item._id,
    name: item.name,
  }));
}
