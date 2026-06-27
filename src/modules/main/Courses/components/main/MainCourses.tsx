import {
  GetAllCourses,
  ICourseData,
  ICourseResult,
} from "@/core/services/api/get/getAllCourses";
import CourseCard from "../../views/CourseCard";
import CoursesPagination from "./Pagination";
import CoursesSort from "./sort";
import { ICourseParams } from "@/app/(main)/courses/page";

async function MainCourses({ params }: { params: ICourseParams }) {
  const data: ICourseResult = await GetAllCourses(params);
  const courses = data?.data || [];
  const totalPage = data?.meta?.pages || 1;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: data?.data.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${item.__v}`,
    })),
  };
  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
      <div className="flex flex-col gap-2">
        <CoursesSort />
        <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-5 mt-4  min-h-screen ">
          {courses.map((items: ICourseData, i) => (
            <CourseCard course={items} classNames="w-full" key={i} />
          ))}
        </div>
        <CoursesPagination totalPages={totalPage} />
      </div>
    </>
  );
}

export default MainCourses;
