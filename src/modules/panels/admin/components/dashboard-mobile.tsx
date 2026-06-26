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

export function DashboardMobile({ coursesData }: Props) {
  return (
    <div className="space-y-4 px-6 pb-4 md:hidden">
      {coursesData.courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
          <Lottie style={{ width: 200, height: 200 }} animationData={Empty} />
          <p>No courses found</p>
        </div>
      ) : (
        coursesData.courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex w-full gap-3">
                {course.image ? (
                  <Link href={`/courses/${course.id}`}>
                    <Image
                      src={course.image ?? "/images/people.png"}
                      alt={course.title}
                      width={112}
                      height={64}
                      className="h-16 w-28 rounded-xl object-cover shrink-0 dark:bg-[#ccc]"
                    />
                  </Link>
                ) : (
                  <div className="h-16 w-24 shrink-0 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300" />
                )}

                <div className="flex-1">
                  <Link
                    href={`/courses/${course.id}`}
                    className="line-clamp-2 font-semibold text-slate-900 dark:text-white w-20 sm:w-auto"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-[#898989]">
                    {course.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-[black] dark:text-[white]">
                  Teacher : {course.instructor}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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

                <Badge variant="secondary" className="rounded-full">
                  {course.level}
                </Badge>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
