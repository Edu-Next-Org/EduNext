"use client";

import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import type { UpdateCourseData } from "./modals/updateCourseForm";
import type { ViewCourseData } from "./modals/courseViewModal";

interface ManageCoursesDesktopProps {
  courses: AdminCourse[];
  setSelectedCourseForEdit: (data: UpdateCourseData) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setSelectedCourseForView: (data: ViewCourseData) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setSelectedCourseId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

export function ManageCoursesDesktop({
  courses,
  setSelectedCourseForEdit,
  setIsEditModalOpen,
  setSelectedCourseForView,
  setIsViewModalOpen,
  setSelectedCourseId,
  setIsDeleteModalOpen,
}: ManageCoursesDesktopProps) {
  return (
    <div className="hidden overflow-x-auto xl:block">
      <table className="min-w-full text-left text-sm">
        <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
          <tr>
            <th className="w-[400px] px-10 py-4 font-medium dark:text-[#ccc]">
              Course
            </th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Teacher</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Category</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Price</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-b border-slate-100">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/courses/${course.id}`}
                    className="relative h-14 w-24 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <Image
                      src={course.image ?? "/images/imageUn.png"}
                      alt={course.title}
                      fill
                      className="rounded-xl object-cover dark:bg-[#ccc]"
                    />
                  </Link>

                  <div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="font-medium text-slate-900 dark:text-[white] hover:text-violet-600 dark:hover:!text-violet-400 transition-colors"
                    >
                      {course.title}
                    </Link>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <div className="font-medium dark:text-[white]">
                  {course.instructor}
                </div>
              </td>

              <td className="px-4 py-4 text-slate-700 dark:text-[#ccc]">
                {course.category}
              </td>

              <td className="px-4 py-4">
                <div>{`${course.price.toLocaleString("en-US")} $`} </div>
              </td>

              <td className="px-4 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="rounded-2xl">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCourseForEdit({
                          id: course.id,
                          title: course.title,
                          description: course.description || "",
                          category: course.categoryId,
                          level: course.levelId,
                          teacher: course.instructorId,
                          teacherName: course.instructor,
                          teacherImage: course.instructorImage || "",
                          price: course.price ? course.price.toString() : "",
                          rating: course.rating ? course.rating.toString() : "",
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCourseForView({
                          id: course.id,
                          title: course.title,
                          description: course.description,
                          category: course.category,
                          level: course.level,
                          teacher: course.instructor,
                          rate: course.rating,
                          price: `${course.price.toLocaleString("en-US")} $`,
                          image: course.image ?? "/images/ImageUn.png",
                        });
                        setIsViewModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-rose-600 cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
