import {
  GetAllCourses,
  ICourseData,
  ICourseResult,
} from "@/core/services/api/Get/GetAllCourses";
import CourseCard from "../../views/CourseCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ICourses } from "../../types/CoursesTP";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CoursesPagination from "./Pagination";
import CoursesSort from "./sort";
import { ICourseParams } from "@/app/(main)/courses/page";

async function MainCourses({ params }: { params: ICourseParams }) {
  const data: ICourseResult = await GetAllCourses(params);
  const courses = data?.data || [];
  const totalPage = data?.meta?.pages || 1;
  return (
    <div className="flex flex-col gap-2">
      <CoursesSort />
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-5 mt-4 ">
        {courses.map((items: ICourseData, i) => (
          <CourseCard course={items} classNames="w-full" key={i} />
        ))}
      </div>
      <CoursesPagination totalPages={totalPage} />
    </div>
  );
}

export default MainCourses;
