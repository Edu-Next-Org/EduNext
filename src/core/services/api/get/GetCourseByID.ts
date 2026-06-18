export type SyllabusItem = {
  id: number;
  instructor: string;
  lessonName: string;
  status: "Watched" | "Locked" | "Pending";
  avatar: string;
};

export type Review = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: string;
  replies?: Review[];
};

export type CourseCategory = {
  _id: string;
  name: string;
};

export type CourseDetailData = {
  _id: string;
  title: string;
  description: string;
  categories: CourseCategory[];
  price: number;
  teacherName: string;
  teacherImage?: string;
  courseVideo?: string;
  courseImage?: string;
  syllabus?: SyllabusItem[];
  reviews?: Review[];
  isFavorite?: boolean;
  isPurchased?: boolean;
  progress?: number;
  isVideoCompleted?: boolean;
  examStatus?: {
    taken: boolean;
    passed?: boolean;
  };
  certificate?: {
    issued: boolean;
  };
};

import { cookies } from "next/headers";

export async function GetCourseByID(id: string): Promise<CourseDetailData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${baseUrl}/courses/${id}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }

  const json = await res.json();
  const rawData = json.data;

  return {
    ...rawData,
    teacherName: rawData.teacher?.name || "Unknown Teacher",
    teacherImage: rawData.teacher?.profileImage || "",
    isFavorite: rawData.isFavorite ?? false,
    isPurchased: rawData.isPurchased ?? false,
  } as CourseDetailData;
}
