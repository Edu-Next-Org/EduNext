import { cookies } from "next/headers";

export type GrowthData = {
  difference: number;
  percentage: number;
};

export type ReportMetric = {
  total: number;
  thisMonth: number;
  growth: GrowthData;
};

export type AdminReportData = {
  totalStudents: ReportMetric;
  totalCourses: ReportMetric;
  totalSales: ReportMetric;
  totalSoldCourses: number;
};

export type AdminReportResponse = {
  success: boolean;
  data: AdminReportData;
};

export async function getAdminReports(): Promise<AdminReportResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-panel/reports`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch admin reports: ${res.status}`);
  }

  return res.json();
}
