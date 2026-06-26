import { cookies } from "next/headers";

export interface ApiQuestion {
  _id: string;
  exam: string;
  text: string;
  options: string[];
  correctAnswer: string;
  score: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiQuestionsResponse {
  success: boolean;
  data: ApiQuestion[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getQuestionsAdmin(
  examId: string,
): Promise<ApiQuestion[]> {
  if (!examId) return [];

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/questions/exam/${examId}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    return [];
  }

  const json: ApiQuestionsResponse = await res.json();
  return json.data;
}
