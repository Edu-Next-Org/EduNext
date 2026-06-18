import api from "@/core/services/api";

export interface ReplyUser {
  _id: string;
  name: string;
  profileImage: string | null;
}

export interface ReplyData {
  _id: string;
  content: string;
  createdAt: string;
  user: ReplyUser;
}

interface GetRepliesResponse {
  success: boolean;
  data: ReplyData[];
}

export async function getCommentReply(commentId: string): Promise<ReplyData[]> {
  try {
    const response = await api.get<GetRepliesResponse>(`/replies/${commentId}`);
    return response.data.data ?? [];
  } catch {
    return [];
  }
}
