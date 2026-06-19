"use server";

import { cookies } from "next/headers";

export interface ApiPaymentUser {
  _id: string;
  name: string;
  profileImage: string | null;
}

export interface ApiPaymentCourse {
  _id: string;
  title: string;
  courseImage: string | null;
  price: number;
}

export interface ApiPaymentItem {
  _id: string;
  user: ApiPaymentUser;
  course: ApiPaymentCourse;
  amount: number;
  status: string;
  createdAt: string;
}

export interface ApiPaymentMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiAllPaymentResponse {
  data: ApiPaymentItem[];
  meta: ApiPaymentMeta;
}

export interface PaymentRecord {
  id: string;
  userName: string;
  courseName: string;
  userImage: string;
  status: "Success" | "Failed";
  price: string;
  date: string;
}

export interface AllPaymentsPageData {
  payments: PaymentRecord[];
  meta: ApiPaymentMeta;
}

interface GetPaymentsParams {
  page?: number;
  limit?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getAllPayments({
  page = 1,
  limit = 10,
}: GetPaymentsParams = {}): Promise<AllPaymentsPageData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${API_BASE}/payments/all-payments?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!res.ok) {
    throw new Error(`getAllPayments failed: ${res.status}`);
  }

  const json = await res.json();

  const rawData: ApiPaymentItem[] = Array.isArray(json)
    ? json
    : json.data || [];
  const meta: ApiPaymentMeta = json.meta || {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  };

  const mappedPayments: PaymentRecord[] = rawData.map((item) => {
    const dateObj = new Date(item.createdAt);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      id: item._id,
      userName: item.user?.name ?? "Unknown User",
      courseName: item.course?.title ?? "Unknown Course",
      userImage: item.user?.profileImage ?? "/images/people.png",
      status: item.status.toUpperCase() === "SUCCESS" ? "Success" : "Failed",
      price: `$${item.amount.toLocaleString()}`,
      date: `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`,
    };
  });

  return {
    payments: mappedPayments,
    meta,
  };
}
