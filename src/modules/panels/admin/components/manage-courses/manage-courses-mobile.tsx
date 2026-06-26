"use client";

import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import type { UpdateCourseData } from "./modals/updateCourseForm";
import type { ViewCourseData } from "./modals/courseViewModal";

interface ManageCoursesMobileProps {
  courses: AdminCourse[];
  setSelectedCourseForEdit: (data: UpdateCourseData) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setSelectedCourseForView: (data: ViewCourseData) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setSelectedCourseId: (id: string) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

export function ManageCoursesMobile({
  courses,
  setSelectedCourseForEdit,
  setIsEditModalOpen,
  setSelectedCourseForView,
  setIsViewModalOpen,
  setSelectedCourseId,
  setIsDeleteModalOpen,
}: ManageCoursesMobileProps) {
  return (
    <div className="space-y-4 xl:hidden py-5">
      {courses.map((course) => (
        <div
          key={course.id}
          className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <Link
                href={`/courses/${course.id}`}
                className="relative h-16 w-24 shrink-0 rounded-xl"
              >
                <Image
                  src={course.image ?? "/images/imageUn.png"}
                  alt={course.title}
                  fill
                  className="rounded-xl object-cover"
                />
              </Link>

              <div>
                <Link
                  href={`/courses/${course.id}`}
                  className="font-semibold text-slate-900 dark:text-white"
                >
                  {course.title}
                </Link>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
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
                      image: course.image ?? "/images/HTML5Course.png",
                    });
                    setIsViewModalOpen(true);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-rose-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="font-medium dark:text-white">
                Teacher : {course.instructor}
              </div>

              <div className="mt-2 text-xs font-medium dark:text-white">
                Level: {course.level}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full py-2">
                {course.category}
              </Badge>

              <div>{`${course.price.toLocaleString("en-US")} $`} </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
