import { cookies } from "next/headers";

export interface SalesCardMetric {
  value: number;
  changePercent: number;
}

export interface SalesCards {
  revenue: SalesCardMetric;
  transactions: SalesCardMetric;
  failedPayments: SalesCardMetric;
  averageTransactionValue: SalesCardMetric;
}

export interface SalesChart {
  labels: string[];
  revenue: number[];
  transactions: number[];
}

export interface SalesOverviewData {
  period: number;
  cards: SalesCards;
  chart: SalesChart;
}

export interface SalesOverviewResponseBody {
  success: boolean;
  data: SalesOverviewData;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function getSalesOverview(
  period: number = 7,
): Promise<SalesOverviewResponseBody> {
  const qs = new URLSearchParams({
    period: String(period),
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${API_BASE}/payments/overview?${qs.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`getSalesOverview failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
