import { BaseUrl } from "@/Utils/URL";

export interface ILevelsResponse {
  success: boolean;
  data: ILevelsData[];
}
export interface ILevelsData {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export const GetAllLevels = async (): Promise<ILevelsResponse> => {
  const res = await fetch(`${BaseUrl}/course-levels`, {
    next: {
      revalidate: 60,
    },
  });
  if (!res.ok) {
    throw new Error("faild to fetch levels");
  }
  const data = await res.json();
  console.log("Levels : ", data);
  return data;
};
