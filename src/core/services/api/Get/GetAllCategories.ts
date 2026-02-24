import { BaseUrl } from "@/Utils/URL";

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
  const res = await fetch(`${BaseUrl}/categories`, {
    next: {
      revalidate: 60,
    },
  });
  if (!res.ok) {
    throw new Error("faild to fetch categories");
  }
  const data = await res.json();
  console.log("categories : ", data);
  return data;
};
