import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getRelatedCourses } from "@/core/services/api/Get/GetRelatedCourse";

interface RelatedCoursesProps {
  courseId: string;
}

export default async function RelatedCourses({
  courseId,
}: RelatedCoursesProps) {
  const relatedCourses = await getRelatedCourses(courseId, 5);

  if (!relatedCourses || relatedCourses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:bg-[#333] dark:border-none">
      <h3 className="text-xl font-bold mb-5 px-1 dark:text-[white]">
        Related Courses
      </h3>

      <ul className="flex flex-col gap-2">
        {relatedCourses.map((course) => {
          const categoryName = course.categories?.[0]?.name || "General";
          const formattedDate = new Date(course.createdAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            },
          );

          return (
            <li key={course._id}>
              <Link
                href={`/coursedetail/${course._id}`}
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#222] transition-colors cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className=" w-18 h-10 sm:w-25 sm:h-12 lg:w-20 lg:h-11 xl:w-25 xl:h-12 flex-shrink-0">
                    <Image
                      src={course.courseImage || "/images/HTML5Course.png"}
                      alt={course.title}
                      width={60}
                      height={60}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col min-w-0 max-w-[90px] sm:max-w-[100px]">
                    <span className="font-bold text-sm text-gray-800 dark:text-[white] truncate">
                      {course.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-[#898989] truncate">
                      {course.teacher?.name} • {formattedDate}
                    </span>
                  </div>
                </div>

                <span className="flex-shrink-0 max-w-[42%] sm:max-w-none text-[10px] px-2 py-1 dark:bg-[#444] rounded font-medium bg-purple-50 text-[#644DB3] dark:text-purple-300 whitespace-nowrap truncate">
                  {categoryName}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
