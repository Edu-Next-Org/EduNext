import Courses from "@/modules/main/Courses/views/Courses";

interface EventPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    courseLevel?: string;
    categories?: string;
    price?: string;
    sort?: string;
  }>;
}
export interface ICourseParams {
  search?: string;
  page?: string;
  limit?: string;
  courseLevel?: string;
  categories?: string;
  price?: string;
  sort?: string;
}
export default async function CoursesPage({ searchParams }: EventPageProps) {
  const params: ICourseParams = await searchParams;

  return (
    <>
      <Courses params={params} />
    </>
  );
}
