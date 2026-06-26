"use client";

import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { Badge } from "@/components/ui/badge";
import Empty from "@/assets/Lottie/Empty.json";
import type { CoursesPageData } from "@/core/services/api/Get/GetAllCoursesAdmin";

type Props = {
  coursesData: CoursesPageData;
};

export function DashboardDesktop({ coursesData }: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full text-left text-sm">
        <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
          <tr>
            <th className="w-[350px] px-10 py-4 font-medium dark:text-[#ccc]">
              Course
            </th>
            <th className="px-6 py-4 font-medium dark:text-[#ccc]">Teacher</th>
            <th className="px-6 py-4 font-medium dark:text-[#ccc]">Category</th>
            <th className="px-6 py-4 font-medium dark:text-[#ccc]">Price</th>
          </tr>
        </thead>

        <tbody>
          {coursesData.courses.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="pt-10 pb-10 text-slate-500 dark:text-[#aaa]"
              >
                <div className="flex flex-col items-center justify-center gap-10">
                  <Lottie
                    style={{ width: 200, height: 200 }}
                    animationData={Empty}
                  />
                  <p>No courses found</p>
                </div>
              </td>
            </tr>
          ) : (
            coursesData.courses.map((course) => (
              <tr
                key={course.id}
                className="border-b border-slate-100 dark:border-[#444]"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {course.image ? (
                    <Link href={`/courses/${course.id}`}>
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={112}
                        height={64}
                        className="h-16 w-28 rounded-xl object-cover shrink-0 dark:bg-[#ccc] transition-all duration-300 hover:shadow-lg"
                      />
                    </Link>
                  ) : (
                    <div className="h-16 w-28 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 shrink-0" />
                  )}
                  <Link
                    href={`/courses/${course.id}`}
                    className="font-semibold text-slate-900 dark:text-white line-clamp-2 hover:!text-violet-400 transition-colors"
                  >
                    {course.title}
                  </Link>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700 dark:text-[#ccc]">
                    {course.instructor}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-700 dark:text-[#ccc]">
                  {course.category}
                </td>

                <td className="px-6 py-4">
                  <Badge
                    className="
                      rounded-full
                      bg-violet-100
                      text-violet-700
                      px-3.5
                      py-1
                      font-semibold
                      shadow-sm
                      dark:bg-violet-500/15
                      dark:text-violet-300
                    "
                  >
                    ${course.price}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
