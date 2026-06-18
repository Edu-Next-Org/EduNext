"use server";

import { cookies } from "next/headers";

export async function GetVerifyPayment(token: string, payerId?: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/verify`,
  );
  url.searchParams.append("token", token);
  if (payerId) {
    url.searchParams.append("PayerID", payerId);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      redirect: "manual",
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers.get("location");
      if (redirectUrl) {
        return redirectUrl;
      }
    }

    if (response.ok) {
      return `/payment/success?ref=unknown`;
    }

    return "/payment/cancel";
  } catch (error) {
    console.error("VerifyPayment Action Error:", error);
    return "/payment/cancel";
  }
}
