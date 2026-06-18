"use client";

import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Layers, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CreateCourseModal } from "./modals/createCourseModal";
import { DeleteCourseModal } from "./modals/deleteCourseModal";
import {
  UpdateCourseModal,
  type UpdateCourseData,
} from "./modals/updateCourseModal";
import { CourseViewModal, type ViewCourseData } from "./modals/courseViewModal";
import { ManageCategoryModal } from "./modals/manageCategoryModal";
import { ManageLevelModal } from "./modals/manageLevelModal";
import { PaginationComp } from "@/components/PaginationComp";
import type { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import type { AdminCategory } from "@/core/services/api/Get/GetAllCategoryAdmin";
import type { AdminLevel } from "@/core/services/api/Get/GetAllLevelsAdmin";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";
import Link from "next/link";

interface ManageCoursesProps {
  courses: AdminCourse[];
  categories: AdminCategory[];
  levels: AdminLevel[];
  currentPage: number;
  totalPages: number;
  search: string;
  selectedCategory: string;
  selectedLevel: string;
}

export function ManageCourses({
  courses,
  categories,
  levels,
  currentPage,
  totalPages,
  search,
  selectedCategory,
  selectedLevel,
}: ManageCoursesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] =
    useState<UpdateCourseData | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourseForView, setSelectedCourseForView] =
    useState<ViewCourseData | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const updateQuery = useCallback(
    (
      updates: Record<string, string | null | undefined>,
      options?: { resetPage?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (options?.resetPage ?? true) {
        params.set("page", "1");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (searchValue === currentSearch) return;

      updateQuery({ search: searchValue || null });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchValue, searchParams, updateQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between ">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight dark:text-[white]">
            Course Management
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc]">
            Manage all courses, filter them, and update status quickly.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center  gap-5 sm:gap-3 lg:gap-2 xl:gap-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className=" cursor-pointer rounded-2xl bg-violet-600 hover:bg-violet-700 sm:w-[32%]  xl:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
          <Button
            onClick={() => setIsCategoryModalOpen(true)}
            variant="outline"
            className=" cursor-pointer sm:w-[32%] rounded-2xl border-violet-600 text-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500/10  xl:w-auto"
          >
            <Layers className="mr-2 h-4 w-4" />
            Manage Categories
          </Button>
          <Button
            onClick={() => setIsLevelModalOpen(true)}
            variant="outline"
            className=" cursor-pointer sm:w-[32%] rounded-2xl border-violet-600 text-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500/10  xl:w-auto"
          >
            <Gauge className="mr-2 h-4 w-4" />
            Manage Levels
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]">
        <CardContent className="space-y-4">
          <div className="mt-7 grid gap-5 md:gap-3 md:grid-cols-2 lg:grid-cols-12">
            <div className="relative  lg:col-span-5">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                className="rounded-2xl py-5 pl-10"
                placeholder="Search courses..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center justify-between md:justify-start md:gap-3">
              <Select
                value={selectedCategory}
                onValueChange={(value) => updateQuery({ categories: value })}
              >
                <SelectTrigger className="rounded-2xl py-5">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedLevel}
                onValueChange={(value) => updateQuery({ courseLevel: value })}
              >
                <SelectTrigger className="rounded-2xl py-5">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="py-16 text-center text-slate-500 dark:text-[#898989]">
              <div className="flex flex-col items-center justify-center gap-10  text-slate-500 dark:text-[#aaa]">
                <Lottie
                  style={{ width: 200, height: 200 }}
                  animationData={Empty}
                />
                <p> No result found</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
                    <tr>
                      <th className="w-[400px] px-10 py-4 font-medium dark:text-[#ccc]">
                        Course
                      </th>

                      <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                        Teacher
                      </th>

                      <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                        Category
                      </th>

                      <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                        Price
                      </th>

                      <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b border-slate-100">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/coursedetail/${course.id}`}
                              className="relative h-14 w-24 rounded-xl transition-all duration-300  hover:shadow-lg"
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
                                href={`/coursedetail/${course.id}`}
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
                          <div>
                            {`${course.price.toLocaleString("en-US")} $`}{" "}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="rounded-2xl"
                            >
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
                                    price: course.price
                                      ? course.price.toString()
                                      : "",
                                    rating: course.rating
                                      ? course.rating.toString()
                                      : "",
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
                                    image:
                                      course.image ?? "/images/ImageUn.png",
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 xl:hidden py-5">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/coursedetail/${course.id}`}
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
                            href={`/coursedetail/${course.id}`}
                            className="font-semibold text-slate-900 dark:text-white"
                          >
                            {course.title}
                          </Link>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl"
                        >
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
                                price: course.price
                                  ? course.price.toString()
                                  : "",
                                rating: course.rating
                                  ? course.rating.toString()
                                  : "",
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
                                image:
                                  course.image ?? "/images/HTML5Course.png",
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
                        <Badge
                          variant="secondary"
                          className="rounded-full py-2"
                        >
                          {course.category}
                        </Badge>

                        <div>
                          {`${course.price.toLocaleString("en-US")} $`}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <PaginationComp currentPage={currentPage} totalPages={totalPages} />
      </Card>
      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        levels={levels}
      />

      <UpdateCourseModal
        key={
          isEditModalOpen
            ? `edit-modal-${selectedCourseForEdit?.id}`
            : "edit-modal-closed"
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedCourseForEdit}
        categories={categories}
        levels={levels}
      />
      <CourseViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        courseData={selectedCourseForView}
      />
      <ManageCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
      />
      <ManageLevelModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        levels={levels}
      />
      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCourseId(null);
        }}
        courseId={selectedCourseId}
        courseTitle={
          courses.find((c) => c.id === selectedCourseId)?.title || ""
        }
      />
    </motion.div>
  );
}
