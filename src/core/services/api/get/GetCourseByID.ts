import { buttonVariants } from '@/components/ui/button';
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

export type CourseDetailData = {
  _id: string;
  title: string;
  description: string;
  category : string;
  price: number;
  teacherName:string;
  courseImage?: string;
  teacherImage?: string;
  courseVideo?: string;
  syllabus?: SyllabusItem[];
  reviews?: Review[];
  isFavorite?: boolean;
};



export async function GetCourseByID(id: string): Promise<CourseDetailData> {

   const isServer = typeof window === "undefined";

    const API_BASE = isServer 
    ? "https://edunext-api.onrender.com/api" 
    : "/api"; 

  const url = `${API_BASE}/courses/${id}`;
  


  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
 
    throw ("error");
  }

  const json = await res.json();
  return json.data as CourseDetailData;
}