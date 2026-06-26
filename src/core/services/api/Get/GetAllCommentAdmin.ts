import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface ApiCommentUser {
  _id: string;
  name: string;
  profileImage: string | null;
}

export interface ApiCommentCourse {
  _id: string;
  title: string;
}

export interface ApiComment {
  _id: string;
  course: ApiCommentCourse;
  user: ApiCommentUser;
  content: string;
  isConfirmed: boolean;
  createdAt: string;
  __v: number;
}

export interface ApiCommentsResponse {
  data?: ApiComment[];
  comments?: ApiComment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MappedComment {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  isConfirmed: boolean;
  date: string;
}

export interface CommentsPageData {
  comments: MappedComment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCommentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  courseId?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toMappedComment(raw: ApiComment): MappedComment {
  return {
    id: raw._id,
    courseId: raw.course?._id ?? "unknown-course",
    courseTitle: raw.course?.title ?? "Course Deleted",
    userId: raw.user?._id ?? "unknown-user",
    userName: raw.user?.name ?? "Deleted User",
    userImage: raw.user?.profileImage ?? "/images/people.png",
    content: raw.content,
    isConfirmed: raw.isConfirmed,
    date: formatDate(raw.createdAt),
  };
}

export async function getAllComments(
  params: GetCommentsParams = {},
): Promise<CommentsPageData> {
  const { page = 1, limit = 10, search, status, courseId } = params;

  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) qs.set("search", search);
  if (status && status !== "all") qs.set("status", status);
  if (courseId && courseId !== "all-courses") qs.set("courseId", courseId);

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/comments/admin?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`getAllComments failed: ${res.status} ${res.statusText}`);
  }

  const responseData = (await res.json()) as ApiCommentsResponse;

  const rawComments: ApiComment[] =
    responseData.data ?? responseData.comments ?? [];

  return {
    comments: rawComments.map(toMappedComment),
    meta: {
      total: responseData.total || rawComments.length,
      page: responseData.page || page,
      limit: responseData.limit || limit,
      totalPages: responseData.totalPages || 1,
    },
  };
}
