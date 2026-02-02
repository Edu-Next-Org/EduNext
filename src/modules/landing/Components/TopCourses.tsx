import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CourseCard from "@/modules/Courses/views/CourseCard";

function TopCourses() {
  const Courses: string[] = ["", "", ""];
  return (
    <div className="w-full min-h-[500px] lg:px-20 px-6 pb-8  bg-[#eeee] ">
      <div className="w-full h-[20%] flex justify-between items-center border-b-2 border-[#bbbb] pb-1 ">
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
      <div className="h-[80%] w-full flex md:flex-row flex-col gap-5 justify-between mt-7 ">
        {Courses.map((_, index) => (
          <CourseCard classNames="lg:flex-1/3" key={index} />
        ))}
      </div>
    </div>
  );
}

export default TopCourses;
