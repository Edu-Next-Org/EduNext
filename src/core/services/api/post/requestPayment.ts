"use server";

import { cookies } from "next/headers";

export async function RequestPayment(courseId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Please log in to your account first.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success || !result.data?.paymentUrl) {
    throw new Error(
      result.message || "Failed to connect to the payment gateway.",
    );
  }

  return result.data.paymentUrl;
}
