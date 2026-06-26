export interface ICategoriesResponse {
  success: boolean;
  data: ICategoriesData[];
}
export interface ICategoriesData {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const GetAllCategories = async (): Promise<ICategoriesResponse> => {
  const isServer = typeof window === "undefined";
  const API_BASE = isServer
    ? "https://edunext-api-docker.onrender.com/api"
    : "/api";

  const res = await fetch(`${API_BASE}/categories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("failed to fetch categories");
  const data = await res.json();
  return data;
};
