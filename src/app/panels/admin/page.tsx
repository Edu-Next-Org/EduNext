import { AdminDashboard } from "@/modules/panels/admin/components/dashboard";
import { getAdminDashboardData } from "@/modules/panels/admin/data/mock";
import { getAdminReports } from "@/core/services/api/Get/GetAdminReports";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { getAllCategoryAdmin } from "@/core/services/api/Get/GetAllCategoryAdmin";
import { getAllLevelsAdmin } from "@/core/services/api/Get/GetAllLevelsAdmin";
import { getLatestTransactions } from "@/core/services/api/Get/GetLatestTransaction";
import { getAllPayments } from "@/core/services/api/Get/GetAllPayment";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = params.search;
  const categories = params.categories;
  const courseLevel = params.courseLevel;
  const page = params.page ? Number(params.page) : 1;

  const paymentPage = params.paymentPage ? Number(params.paymentPage) : 1;

  const [
    mockData,
    reportsRes,
    coursesRes,
    categoriesRes,
    levelsRes,
    latestTransactions,
    allPaymentsRes,
  ] = await Promise.all([
    getAdminDashboardData(),
    getAdminReports(),
    getAllCoursesAdmin({ page, limit: 8, search, categories, courseLevel }),
    getAllCategoryAdmin(),
    getAllLevelsAdmin(),
    getLatestTransactions(4),
    getAllPayments({ page: paymentPage, limit: 10 }),
  ]);

  return (
    <AdminDashboard
      reports={reportsRes.data}
      coursesData={coursesRes}
      categories={categoriesRes}
      levels={levelsRes}
      latestTransactions={latestTransactions}
      allPaymentsData={allPaymentsRes}
    />
  );
}
