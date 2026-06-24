import { cookies } from "next/headers";

export interface ApiExamCourse {
  _id: string;
  courseVideo: string | null;
  title: string;
  description: string;
  categories: string[];
  courseLevel: string;
  teacher: string;
  courseImage: string | null;
  rating: number;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiExam {
  _id: string;
  course: ApiExamCourse;
  title: string;
  passingScore: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiExamResponse {
  success: boolean;
  data: ApiExam | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getExamAdmin(courseId: string): Promise<ApiExam | null> {
  if (!courseId) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/exams/course/${courseId}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    return null;
  }

  const json: ApiExamResponse = await res.json();
  return json.data;
}
