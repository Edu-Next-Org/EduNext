export const dynamic = "force-dynamic";

import { ManageCourses } from "@/modules/panels/admin/components/manage-courses/manage-courses";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { getAllCategoryAdmin } from "@/core/services/api/Get/GetAllCategoryAdmin";
import { getAllLevelsAdmin } from "@/core/services/api/Get/GetAllLevelsAdmin";

interface PageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    categories?: string;
    courseLevel?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};

  const currentPage = Number(sp.page ?? "1") || 1;
  const limit = Number(sp.limit ?? "10") || 10;
  const search = sp.search?.trim() || undefined;
  const categories = sp.categories?.trim() || undefined;
  const courseLevel = sp.courseLevel?.trim() || undefined;

  const [coursesData, categoriesData, levelsData] = await Promise.all([
    getAllCoursesAdmin({
      page: currentPage,
      limit,
      search,
      categories,
      courseLevel,
    }),
    getAllCategoryAdmin(),
    getAllLevelsAdmin(),
  ]);

  return (
    <ManageCourses
      courses={coursesData.courses}
      categories={categoriesData}
      levels={levelsData}
      currentPage={coursesData.meta.page}
      totalPages={coursesData.meta.pages}
      search={search ?? ""}
      selectedCategory={categories ?? "all"}
      selectedLevel={courseLevel ?? "all"}
    />
  );
}
