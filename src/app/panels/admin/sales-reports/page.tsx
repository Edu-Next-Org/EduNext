import { SalesReports } from "@/modules/panels/admin/components/sales-reports/sales-reports";
import { getSalesOverview } from "@/core/services/api/Get/GetSalesOverview";
import { getAllPayments } from "@/core/services/api/Get/GetAllPayment";
import { getLatestTransactions } from "@/core/services/api/Get/GetLatestTransaction";

type PageProps = {
  searchParams: Promise<{
    paymentPage?: string;
    period?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const periodParam = params.period?.replace("d", "") || "7";
  const periodNumber = parseInt(periodParam, 10);

  const [salesOverviewRes, allPaymentsRes, latestTransactions] =
    await Promise.all([
      getSalesOverview(periodNumber),
      getAllPayments({ page: 1, limit: 10 }),
      getLatestTransactions(4),
    ]);

  return (
    <SalesReports
      salesOverviewData={salesOverviewRes.data}
      allPaymentsData={allPaymentsRes}
      latestTransactions={latestTransactions}
    />
  );
}
