import { cookies } from "next/headers";

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  gender: string | null;
  birthday: string | null;
  about: string | null;
  profileImage: string | null;
  profileImagePublicId: string | null;
  purchasedCourses: string[];
  role: string[];
  isVerified: boolean;
  courseProgress: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface ApiUsersResponseBody {
  success: boolean;
  data: {
    data: ApiUser[];
    meta: ApiMeta;
  };
  meta: ApiMeta;
}

export type UserStatus = "Active" | "Pending" | "Blocked";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: UserStatus;
  createdAt: string;
  gender: string | null;
  phoneNumber: string | null;
  birthday: string | null;
  about: string | null;
  profileImage: string | null;
}

export interface UsersPageData {
  users: AdminUser[];
  meta: ApiMeta;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toAdminUser(raw: ApiUser): AdminUser {
  return {
    id: raw._id,
    name: raw.name,
    email: raw.email,
    roles: raw.role,
    status: raw.isVerified ? "Active" : "Pending",
    createdAt: formatDate(raw.createdAt),
    gender: raw.gender,
    phoneNumber: raw.phoneNumber,
    birthday: raw.birthday,
    about: raw.about,
    profileImage: raw.profileImage,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getAllUsers(
  params: GetUsersParams = {},
): Promise<UsersPageData> {
  const { page = 1, limit = 10, search, role } = params;

  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) qs.set("search", search);
  if (role) qs.set("role", role);

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/users?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`getAllUsers failed: ${res.status} ${res.statusText}`);
  }

  const json: ApiUsersResponseBody = await res.json();

  return {
    users: json.data.data.map(toAdminUser),
    meta: json.data.meta,
  };
}
