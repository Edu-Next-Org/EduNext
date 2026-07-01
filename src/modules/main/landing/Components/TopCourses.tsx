// import React from "react";
// import Link from "next/link";
// import { ChevronRight } from "lucide-react";
// import CourseCard from "@/modules/main/Courses/views/CourseCard";
// import {
//   GetAllCourses,
//   ICourseData,
//   ICourseResult,
// } from "@/core/services/api/Get/GetAllCourses";
// import { ICourses } from "@/modules/main/Courses/types/CoursesTP";

// async function TopCourses() {
//   const Courses: ICourseResult = await GetAllCourses();
//   const courseData: ICourseData[] = Courses?.data || [];

//   return (
//     <div className="w-full min-h-[500px] lg:px-20 px-6 pb-8  bg-[#eeee] dark:bg-[#1e1e1e] ">
//       <div className="w-full h-[20%] flex justify-between items-center border-b-2 border-[#bbbb] pb-1 mb-8 ">
//         <h1 className=" text-md lg:text-[26px] font-bold">Featured Courses</h1>
//         <div className="flex gap-2 items-center">
//           <Link
//             className=" text-sm lg:text-md text-gray-600 cursor-pointer dark:text-[#ccc]"
//             href="/courses"
//           >
//             View All Courses
//           </Link>
//           <ChevronRight className=" w-4 h-4 lg:w-5 lg:h-6 text-gray-600" />
//         </div>
//       </div>
//       <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-5 ">
//         {courseData.slice(0, 3).map((items, index) => (
//           <CourseCard course={items} classNames="w-full" key={index} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default TopCourses;

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import CourseCard from "@/modules/main/Courses/views/CourseCard";
import {
  GetAllCourses,
  ICourseData,
  ICourseResult,
} from "@/core/services/api/get/getAllCourses";
import { apiFetch } from "@/core/Fetch";

async function TopCourses() {
  const res = await apiFetch<ICourseResult>(`/courses`, {
    next: { revalidate: 60 * 4 },
    params: {
      limit: 3,
      sort: "latest",
    },
  });
  let courseData = null;
  if ("data" in res) {
    courseData = res.data;
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#eeee] dark:bg-[#1e1e1e]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.10),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.08),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.06),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="relative z-10 w-full px-6 pb-8 pt-18 lg:px-20">
        <div className="mx-auto rounded-[2rem] border border-white/50 bg-white/70 p-6  backdrop-blur-xl dark:border-white/10 dark:bg-white/5 ">
          <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
            <h1 className="text-md font-bold text-slate-950 lg:text-[26px] dark:text-white">
              Featured Courses
            </h1>

            <Link
              className="group flex items-center gap-2 text-sm text-slate-600 transition hover:text-violet-600 dark:text-[#ccc] dark:hover:text-violet-400"
              href="/courses"
            >
              <span className="text-sm lg:text-md">View All Courses</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 lg:h-5 lg:w-5" />
            </Link>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 w-full ">
            {courseData && courseData.length > 0 ? (
              courseData.map((item, index) => (
                <CourseCard course={item} classNames="w-full" key={index} />
              ))
            ) : (
              <p className="mx-auto text-center font-bold">No Courses</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopCourses;
