import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CourseCard from "@/modules/main/Courses/views/CourseCard";
import {
  GetAllCourses,
  ICourseData,
  ICourseResult,
} from "@/core/services/api/Get/GetAllCourses";
import { ICourses } from "@/modules/main/Courses/types/CoursesTP";

async function TopCourses() {
  const Courses: ICourseResult = await GetAllCourses();
  const courseData: ICourseData[] = Courses?.data || [];

  return (
    <div className="w-full min-h-[500px] lg:px-20 px-6 pb-8  bg-[#eeee] dark:bg-[#1e1e1e] ">
      <div className="w-full h-[20%] flex justify-between items-center border-b-2 border-[#bbbb] pb-1 mb-8 ">
        <h1 className=" text-md lg:text-[26px] font-bold">Featured Courses</h1>
        <div className="flex gap-2 items-center">
          <Link
            className=" text-sm lg:text-md text-gray-600 cursor-pointer"
            href="/courses"
          >
            View All Courses
          </Link>
          <ChevronRight className=" w-4 h-4 lg:w-5 lg:h-6 text-gray-600" />
        </div>
      </div>
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-5 ">
        {courseData.slice(0, 3).map((items, index) => (
          <CourseCard course={items} classNames="w-full" key={index} />
        ))}
      </div>
    </div>
  );
}

export default TopCourses;
