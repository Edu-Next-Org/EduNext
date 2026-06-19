import { AdminDashboard } from "@/modules/panels/admin/components/dashboard";
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

  const [
    reportsRes,
    coursesRes,
    categoriesRes,
    levelsRes,
    latestTransactions,
    allPaymentsRes,
    usersRes,
    salesOverviewRes,
  ] = await Promise.all([
    getAdminReports(),
    getAllCoursesAdmin({ page, limit: 8, search, categories, courseLevel }),
    getAllCategoryAdmin(),
    getAllLevelsAdmin(),
    getLatestTransactions(4),
    getAllPayments({ page: 1, limit: 10 }),
    getAllUsers({ page: 1, limit: 10 }),
    getSalesOverview(30),
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
