import { cookies } from "next/headers";

interface ApiCategory {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiCategoriesResponseBody {
  success: boolean;
  data: ApiCategory[];
}

export interface AdminCategory {
  id: string;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getAllCategoryAdmin(): Promise<AdminCategory[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/categories`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(
      `getAllCategoryAdmin failed: ${res.status} ${res.statusText}`,
    );
  }

  const json: ApiCategoriesResponseBody = await res.json();

  return json.data.map((item) => ({
    id: item._id,
    name: item.name,
  }));
}
