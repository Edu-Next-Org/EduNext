import { AdminDashboard } from "@/modules/admin/components/dashboard";
import { getAdminDashboardData } from "@/modules/admin/data/mock";
import { getAdminReports } from "@/core/services/api/Get/GetAdminReports";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { getAllCategoryAdmin } from "@/core/services/api/Get/GetAllCategoryAdmin";
import { getAllLevelsAdmin } from "@/core/services/api/Get/GetAllLevelsAdmin";
import { getLatestTransactions } from "@/core/services/api/Get/GetLatestTransaction";
import { getAllPayments } from "@/core/services/api/Get/GetAllPayment";
import { getAllUsers } from "@/core/services/api/Get/GetAllUser";
import { getSalesOverview } from "@/core/services/api/Get/GetSalesOverview";

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
    usersRes,
    salesOverviewRes,
  ] = await Promise.all([
    getAdminDashboardData(),
    getAdminReports(),
    getAllCoursesAdmin({ page, limit: 8, search, categories, courseLevel }),
    getAllCategoryAdmin(),
    getAllLevelsAdmin(),
    getLatestTransactions(4),
    getAllPayments({ page: paymentPage, limit: 10 }),
    getAllUsers({ page: 1, limit: 10 }),
    getSalesOverview(7),
  ]);

  return (
    <AdminDashboard
      reports={reportsRes.data}
      coursesData={coursesRes}
      categories={categoriesRes}
      levels={levelsRes}
      latestTransactions={latestTransactions}
      allPaymentsData={allPaymentsRes}
      recentUsersData={usersRes}
      salesOverviewData={salesOverviewRes.data}
    />
  );
}
