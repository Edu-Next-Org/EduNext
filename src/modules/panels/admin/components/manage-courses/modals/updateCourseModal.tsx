"use client";

import { useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  UpdateCourseForm,
  type ApiTeacher,
  type UpdateCourseData,
} from "./updateCourseForm";

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UpdateCourseData | null;
  categories: AdminCategory[];
  levels: AdminLevel[];
}

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
      toast.success(data?.message ?? "Course updated successfully!");
      formik.resetForm();
      onClose();
      router.refresh();
    },
    onError: (error: unknown) => {
      let errorMsg = "Error updating course";
      if (isAxiosError(error)) {
        errorMsg = error.response?.data?.message ?? errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });

  const formik = useFormik<UpdateCourseData>({
    enableReinitialize: true,
    initialValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      level: initialData?.level ?? "",
      teacher: initialData?.teacher ?? "",
      price: initialData?.price ?? "",
      rating: initialData?.rating ?? "",
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
        courseImage: values.thumbnail ?? undefined,
        courseVideo: values.promoVideo ?? undefined,
      });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const fetchedTeachers: ApiTeacher[] =
    teachersData?.data?.data ?? teachersData?.data ?? teachersData ?? [];

  const displayTeachers = [...fetchedTeachers];
  const isCurrentTeacherInList = displayTeachers.some(
    (t) => t._id === initialData?.teacher,
  );

  if (!isCurrentTeacherInList && initialData?.teacher) {
    displayTeachers.unshift({
      _id: initialData.teacher,
      name: initialData.teacherName ?? "Unknown teacher",
      email: "",
      profileImage: initialData.teacherImage ?? undefined,
    });
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

        <UpdateCourseForm
          formik={formik}
          categories={categories}
          levels={levels}
          teachersList={displayTeachers}
          isLoadingTeachers={isLoadingTeachers}
          isPending={mutation.isPending}
          onCancel={() => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
