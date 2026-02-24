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
      <div className="w-full flex lg:flex-row lg:flex-wrap flex-col gap-4 justify-between">
        {courses.map((items: ICourseData, i) => (
          <CourseCard course={items} classNames="w-full lg:w-[32%]" key={i} />
        ))}
      </div>
      <CoursesPagination totalPages={totalPage} />
    </div>
  );
}

export default MainCourses;
