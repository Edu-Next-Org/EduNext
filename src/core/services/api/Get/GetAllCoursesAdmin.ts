import { cookies } from "next/headers";

export interface ApiMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface ApiCourseCategory {
  _id: string;
  name: string;
}

interface ApiCourseLevel {
  _id: string;
  name: string;
}

interface ApiCourseTeacher {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  gender: string | null;
  birthday: string | null;
  about: string | null;
  profileImage: string | null;
  role: string[];
}

interface ApiCourse {
  _id: string;
  courseVideo: string | null;
  title: string;
  description: string;
  categories: ApiCourseCategory[];
  courseLevel: ApiCourseLevel | null;
  teacher: ApiCourseTeacher;
  courseImage: string | null;
  rating: number;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isFavorite: boolean;
}

interface ApiCoursesResponseBody {
  success: boolean;
  data: ApiCourse[];
  meta?: ApiMeta;
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  level: string;
  levelId: string;
  instructor: string;
  instructorId: string;
  instructorImage: string | null;
  role: string;
  price: number;
  rating: number;
  status: "Published" | "Draft";
  image: string | null;
}

export interface CoursesPageData {
  courses: AdminCourse[];
  meta: ApiMeta;
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
  courseLevel?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function formatRoles(roles: string[]): string {
  return roles.length ? roles.join(", ") : "-";
}

function toAdminCourse(raw: ApiCourse): AdminCourse {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    category: raw.categories?.length
      ? raw.categories.map((item) => item.name).join(", ")
      : "Not Assigned",
    categoryId: raw.categories?.[0]?._id || "",
    level: raw.courseLevel?.name || "Not Assigned",
    levelId: raw.courseLevel?._id || "",
    instructor: raw.teacher?.name || "Not Assigned",
    instructorId: raw.teacher?._id || "",
    instructorImage: raw.teacher?.profileImage || null,
    role: formatRoles(raw.teacher?.role ?? []),
    price: raw.price,
    rating: raw.rating,
    status: "Published",
    image: raw.courseImage ?? "/images/ImageUn.png",
  };
}

export async function getAllCoursesAdmin(
  params: GetCoursesParams = {},
): Promise<CoursesPageData> {
  const { page = 1, limit = 10, search, categories, courseLevel } = params;

  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) qs.set("search", search);
  if (categories) qs.set("categories", categories);
  if (courseLevel) qs.set("courseLevel", courseLevel);

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/courses?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  console.log("getAllCoursesAdmin URL:", res);

  if (!res.ok) {
    throw new Error(
      `getAllCoursesAdmin failed: ${res.status} ${res.statusText}`,
    );
  }

  const json: ApiCoursesResponseBody = await res.json();
  const meta = json.meta ?? {
    total: json.data.length,
    page,
    pages: 1,
    limit,
  };

  return {
    courses: json.data.map(toAdminCourse),
    meta,
  };
}
