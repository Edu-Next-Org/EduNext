import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface ApiReplyUser {
  _id: string;
  name: string;
  profileImage: string | null;
}

export interface ApiReply {
  _id: string;
  content: string;
  createdAt: string;
  user: ApiReplyUser;
}

export interface ApiRepliesResponse {
  success: boolean;
  data: ApiReply[];
}

export interface MappedReply {
  id: string;
  content: string;
  date: string;
  userId: string;
  userName: string;
  userImage: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toMappedReply(raw: ApiReply): MappedReply {
  return {
    id: raw._id,
    content: raw.content,
    date: formatDate(raw.createdAt),
    userId: raw.user?._id ?? "unknown-user",
    userName: raw.user?.name ?? "Deleted User",
    userImage: raw.user?.profileImage ?? "/images/people.png",
  };
}

export async function getReplyCommentAdmin(
  commentId: string,
): Promise<MappedReply[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/replies/${commentId}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(
      `getReplyCommentAdmin failed: ${res.status} ${res.statusText}`,
    );
  }

  const responseData = (await res.json()) as ApiRepliesResponse;
  const rawReplies: ApiReply[] = responseData.data ?? [];

  return rawReplies.map(toMappedReply);
}
