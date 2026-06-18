import { AdminDashboard } from "@/modules/admin/components/dashboard";
import { getAdminDashboardData } from "@/modules/admin/data/mock";
import { getAdminReports } from "@/core/services/api/Get/GetAdminReports";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { getAllCategoryAdmin } from "@/core/services/api/Get/GetAllCategoryAdmin";
import { getAllLevelsAdmin } from "@/core/services/api/Get/GetAllLevelsAdmin";

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

  const [mockData, reportsRes, coursesRes, categoriesRes, levelsRes] =
    await Promise.all([
      getAdminDashboardData(),
      getAdminReports(),
      getAllCoursesAdmin({ page, limit: 8, search, categories, courseLevel }),
      getAllCategoryAdmin(),
      getAllLevelsAdmin(),
    ]);

  return (
    <AdminDashboard
      mockData={mockData}
      reports={reportsRes.data}
      coursesData={coursesRes}
      categories={categoriesRes}
      levels={levelsRes}
    />
  );
}
