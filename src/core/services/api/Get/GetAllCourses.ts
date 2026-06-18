import { ICourseParams } from "./../../../../app/(main)/courses/page";

export interface ICourseResult {
  success: boolean;
  data: ICourseData[];
  meta: ICourseMeta;
}
export interface ICourseData {
  _id: string;
  courseVideo: string;
  title: string;
  description: string;
  categories: Category[];
  courseLevel: CourseLevel;
  teacherName: string;
  courseImage: string;
  teacherImage: string;
  rating: number;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isFavorite: boolean;
}
export interface Category {
  _id: string;
  name: string;
}
export interface CourseLevel {
  _id: string;
  name: string;
}
export interface ICourseMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export async function GetAllCourses(
  params?: ICourseParams,
): Promise<ICourseResult> {
  try {
    const isServer = typeof window === "undefined";
    const API_BASE = isServer ? "https://edunext-api.onrender.com/api" : "/api";

    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>)}`
      : "";

    const res = await fetch(`${API_BASE}/courses${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);

    const result: ICourseResult = await res.json();
    return result;
  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, pages: 1, limit: 0 },
    };
  }
}
