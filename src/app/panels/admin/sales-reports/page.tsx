import { SalesReports } from "@/modules/panels/admin/components/sales-reports/sales-reports";
import { getSalesData } from "@/modules/panels/admin/data/mock";
import { getAllPayments } from "@/core/services/api/Get/GetAllPayment";

type PageProps = {
  searchParams: Promise<{
    paymentPage?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const paymentPage = params.paymentPage ? Number(params.paymentPage) : 1;

  const [salesData, allPaymentsRes] = await Promise.all([
    getSalesData(),
    getAllPayments({ page: paymentPage, limit: 10 }),
  ]);

  return (
    <SalesReports
      summary={salesData.summary}
      series={salesData.series}
      transactions={salesData.transactions}
      allPaymentsData={allPaymentsRes}
    />
  );
}
