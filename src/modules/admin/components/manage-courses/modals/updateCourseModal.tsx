"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Image as ImageIcon, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { updateCourseAdmin } from "@/core/services/api/put/UpdateCourse";
import { getAllTeachers } from "@/core/services/api/Get/GetAllTeacher";
import type { AdminCategory } from "@/core/services/api/Get/GetAllCategoryAdmin";
import type { AdminLevel } from "@/core/services/api/Get/GetAllLevelsAdmin";

export interface UpdateCourseData {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  level?: string;
  teacher?: string;
  teacherName?: string;
  teacherImage?: string | null;
  price?: string;
  rating?: string;
  thumbnail?: File | null;
  promoVideo?: File | null;
}

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UpdateCourseData | null;
  categories: AdminCategory[];
  levels: AdminLevel[];
}

interface ApiTeacher {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-500">{message}</p>;
};

const validationSchema = Yup.object({
  title: Yup.string().min(1, "Title must be at least 1 character").optional(),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  category: Yup.string().optional(),
  level: Yup.string().optional(),
  teacher: Yup.string().optional(),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .optional(),
  rating: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Min rating is 0")
    .max(5, "Max rating is 5")
    .optional(),
  thumbnail: Yup.mixed<File>().nullable().optional(),
  promoVideo: Yup.mixed<File>().nullable().optional(),
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function UpdateCourseModal({
  isOpen,
  onClose,
  initialData,
  categories,
  levels,
}: UpdateCourseModalProps) {
  const router = useRouter();

  const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers-list"],
    queryFn: () => getAllTeachers("1", "50", ""),
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: updateCourseAdmin,
    onSuccess: (data) => {
      toast.success(data?.message || "Course updated successfully!");
      formik.resetForm();
      onClose();
      router.refresh();
    },
    onError: (error: unknown) => {
      let errorMsg = "Error updating course";
      if (isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });

  const formik = useFormik<UpdateCourseData>({
    enableReinitialize: true,
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      level: initialData?.level || "",
      teacher: initialData?.teacher || "",
      price: initialData?.price || "",
      rating: initialData?.rating || "",
      thumbnail: null,
      promoVideo: null,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!initialData?.id) return;

      mutation.mutate({
        courseId: initialData.id,
        title: values.title,
        courseLevel: values.level,
        categories: values.category,
        price:
          values.price !== "" && values.price !== undefined
            ? Number(values.price)
            : undefined,
        rating: values.rating ? Number(values.rating) : undefined,
        teacherId: values.teacher,
        description: values.description,
        courseImage: values.thumbnail || undefined,
        courseVideo: values.promoVideo || undefined,
      });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const fetchedTeachers: ApiTeacher[] =
    teachersData?.data?.data || teachersData?.data || teachersData || [];

  const displayTeachers = [...fetchedTeachers];
  const isCurrentTeacherInList = displayTeachers.some(
    (t) => t._id === initialData?.teacher,
  );

  if (!isCurrentTeacherInList && initialData?.teacher) {
    displayTeachers.unshift({
      _id: initialData.teacher,
      name: initialData.teacherName || "Unknown teacher",
      profileImage: initialData.teacherImage || null,
    } as ApiTeacher);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[90vh] w-[95vw] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white p-0 shadow-2xl dark:border-[#444] dark:bg-[#333] sm:w-[90vw]"
      >
        <div className="relative z-10 shrink-0 border-b border-slate-100 bg-white/95 px-8 py-7 backdrop-blur dark:border-[#444] dark:bg-[#333]/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Update Course
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-slate-500 dark:text-[#ccc]">
              Modify the details below to update the existing course
              information.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isOpen ? "show" : "hidden"}
              className="space-y-14"
            >
              <motion.div variants={sectionVariants} className="space-y-7">
                <div className="border-b border-slate-100 pb-2 dark:border-[#444]">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                    1. General Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="title"
                      className="text-slate-700 dark:text-[#eee]"
                    >
                      Course Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Title for course"
                      className="rounded-2xl border-slate-200 py-6 text-base transition-all focus:ring-2 focus:ring-violet-600/20 dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white"
                    />
                    <FieldError
                      message={
                        formik.touched.title
                          ? (formik.errors.title as string)
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="description"
                      className="text-slate-700 dark:text-[#eee]"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Briefly describe what students will learn..."
                      className="min-h-[120px] resize-none rounded-2xl border-slate-200 py-4 text-base transition-all focus:ring-2 focus:ring-violet-600/20 dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white"
                    />
                    <FieldError
                      message={
                        formik.touched.description
                          ? (formik.errors.description as string)
                          : undefined
                      }
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-7">
                <div className="border-b border-slate-100 pb-2 dark:border-[#444]">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                    2. Classification & Assignment
                  </h3>
                </div>

                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    <div className="w-full space-y-2.5 md:w-[48%]">
                      <Label className="text-slate-700 dark:text-[#eee]">
                        Category
                      </Label>
                      <Select
                        value={formik.values.category}
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                      >
                        <SelectTrigger className="w-full rounded-2xl border-slate-200 py-6 text-base dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="!max-h-[230px] rounded-2xl dark:border-[#555] dark:bg-[#3a3a3a]"
                        >
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError
                        message={
                          formik.touched.category
                            ? (formik.errors.category as string)
                            : undefined
                        }
                      />
                    </div>

                    <div className="w-full space-y-2.5 md:w-[48%]">
                      <Label className="text-slate-700 dark:text-[#eee]">
                        Course Level
                      </Label>
                      <Select
                        value={formik.values.level}
                        onValueChange={(value) =>
                          formik.setFieldValue("level", value)
                        }
                      >
                        <SelectTrigger className="w-full rounded-2xl border-slate-200 py-6 text-base dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="!max-h-[230px] rounded-2xl dark:border-[#555] dark:bg-[#3a3a3a]"
                        >
                          {levels.map((lvl) => (
                            <SelectItem key={lvl.id} value={lvl.id}>
                              {lvl.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError
                        message={
                          formik.touched.level
                            ? (formik.errors.level as string)
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      Assigned Teacher
                    </Label>
                    <Select
                      value={formik.values.teacher}
                      onValueChange={(value) =>
                        formik.setFieldValue("teacher", value)
                      }
                    >
                      <SelectTrigger className="h-auto min-h-[56px] w-full rounded-2xl border-slate-200 py-6 text-base dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-3">
                        <SelectValue placeholder="Search and assign a teacher" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="!max-h-[230px] rounded-2xl dark:border-[#555] dark:bg-[#3a3a3a]"
                      >
                        {isLoadingTeachers ? (
                          <div className="py-4 text-center text-sm text-slate-500">
                            Loading...
                          </div>
                        ) : displayTeachers.length === 0 ? (
                          <div className="py-4 text-center text-sm text-slate-500">
                            No teachers found
                          </div>
                        ) : (
                          displayTeachers.map((teacher) => (
                            <SelectItem
                              key={teacher._id}
                              value={teacher._id}
                              className="cursor-pointer py-3 hover:bg-slate-50 dark:hover:bg-[#444]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-[#555]">
                                  <Image
                                    src={
                                      teacher.profileImage ||
                                      "/images/people.png"
                                    }
                                    alt={teacher.name}
                                    fill
                                    className="object-cover dark:bg-[#ccc]"
                                  />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    {teacher.name}
                                  </span>
                                  {teacher.email && (
                                    <span className="font-medium text-xs text-[#898989] dark:text-[#ccc]">
                                      {teacher.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>

                      <FieldError
                        message={
                          formik.touched.teacher
                            ? (formik.errors.teacher as string)
                            : undefined
                        }
                      />
                    </Select>
                    <FieldError
                      message={
                        formik.touched.teacher
                          ? (formik.errors.teacher as string)
                          : undefined
                      }
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-7">
                <div className="border-b border-slate-100 pb-2 dark:border-[#444]">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                    3. Pricing & Rating
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="price"
                      className="text-slate-700 dark:text-[#eee]"
                    >
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className="rounded-2xl border-slate-200 py-6 text-base dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white"
                    />
                    <FieldError
                      message={
                        formik.touched.price
                          ? (formik.errors.price as string)
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="rating"
                      className="text-slate-700 dark:text-[#eee]"
                    >
                      Rating
                    </Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formik.values.rating}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.0"
                      className="rounded-2xl border-slate-200 py-6 text-base dark:border-[#555] dark:bg-[#3a3a3a] dark:text-white"
                    />
                    <FieldError
                      message={
                        formik.touched.rating
                          ? (formik.errors.rating as string)
                          : undefined
                      }
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-7">
                <div className="border-b border-slate-100 pb-2 dark:border-[#444]">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                    4. Course Media
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      Course Thumbnail
                    </Label>
                    <label className="group flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-violet-400 hover:bg-violet-50/30 dark:border-[#555] dark:bg-[#3a3a3a]/50 dark:hover:border-violet-500 dark:hover:bg-[#444]">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-white p-3 text-slate-400 shadow-sm transition-colors group-hover:text-violet-600 dark:bg-[#333] dark:group-hover:text-violet-400">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-white">
                          {formik.values.thumbnail
                            ? formik.values.thumbnail.name
                            : "Update Image"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-[#898989]">
                          PNG, JPG
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0] ?? null;
                          formik.setFieldValue("thumbnail", file);
                          formik.setFieldTouched("thumbnail", true);
                        }}
                      />
                    </label>
                    <FieldError
                      message={
                        formik.touched.thumbnail
                          ? (formik.errors.thumbnail as string)
                          : undefined
                      }
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      Course Video
                    </Label>
                    <label className="group flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-violet-400 hover:bg-violet-50/30 dark:border-[#555] dark:bg-[#3a3a3a]/50 dark:hover:border-violet-500 dark:hover:bg-[#444]">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-white p-3 text-slate-400 shadow-sm transition-colors group-hover:text-violet-600 dark:bg-[#333] dark:group-hover:text-violet-400">
                          <Video className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-white">
                          {formik.values.promoVideo
                            ? formik.values.promoVideo.name
                            : "Update Video"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-[#898989]">
                          MP4, WebM
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0] ?? null;
                          formik.setFieldValue("promoVideo", file);
                          formik.setFieldTouched("promoVideo", true);
                        }}
                      />
                    </label>
                    <FieldError
                      message={
                        formik.touched.promoVideo
                          ? (formik.errors.promoVideo as string)
                          : undefined
                      }
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative z-10 shrink-0 border-t border-slate-100 bg-slate-50/80 px-8 py-5 backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]/80">
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-2xl px-6 text-base font-medium hover:bg-slate-200 dark:text-white dark:hover:bg-[#555]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className=" cursor-pointer rounded-2xl bg-violet-600 px-8 py-6 text-base font-medium text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-600/25 disabled:opacity-70"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
