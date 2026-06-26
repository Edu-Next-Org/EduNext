"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { createCourseAdmin } from "@/core/services/api/post/CreateCourse";
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
  CreateCourseForm,
  type ApiTeacher,
  type CreateCourseFormValues,
} from "./createCourseForm";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategory[];
  levels: AdminLevel[];
}

const validationSchema = Yup.object({
  title: Yup.string().required("Course title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  level: Yup.string().required("Course level is required"),
  teacher: Yup.string().required("Assigned teacher is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  rating: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5"),
  thumbnail: Yup.mixed<File>()
    .required("Course thumbnail is required")
    .test(
      "fileRequired",
      "Course thumbnail is required",
      (value) => value instanceof File,
    ),
  promoVideo: Yup.mixed<File>()
    .required("Course video is required")
    .test(
      "fileRequired",
      "Course video is required",
      (value) => value instanceof File,
    ),
});

export function CreateCourseModal({
  isOpen,
  onClose,
  categories,
  levels,
}: CreateCourseModalProps) {
  const router = useRouter();

  const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers-list"],
    queryFn: () => getAllTeachers("1", "50", ""),
    enabled: isOpen,
  });

  const teachersList: ApiTeacher[] =
    teachersData?.data?.data ?? teachersData?.data ?? teachersData ?? [];

  const formik = useFormik<CreateCourseFormValues>({
    initialValues: {
      title: "",
      description: "",
      category: "",
      level: "",
      teacher: "",
      price: "",
      rating: "",
      thumbnail: null,
      promoVideo: null,
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      mutation.mutate({
        title: values.title,
        courseLevel: values.level,
        categories: values.category,
        price: Number(values.price),
        rating: values.rating ? Number(values.rating) : null,
        teacherId: values.teacher,
        description: values.description,
        courseImage: values.thumbnail!,
        courseVideo: values.promoVideo!,
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createCourseAdmin,
    onSuccess: (data) => {
      toast.success(data?.message ?? "Course created successfully");
      formik.resetForm();
      onClose();
      router.refresh();
    },
    onError: (error: unknown) => {
      let errorMsg = "Something went wrong";

      if (isAxiosError(error)) {
        errorMsg = error.response?.data?.message ?? errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }

      toast.error(errorMsg);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          formik.resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white p-0 shadow-2xl dark:border-[#444] dark:bg-[#333] sm:w-[90vw]">
        <div className="relative z-10 shrink-0 border-b border-slate-100 bg-white/95 px-8 py-7 backdrop-blur dark:border-[#444] dark:bg-[#333]/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create a New Course
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-slate-500 dark:text-[#ccc]">
              Complete the details below to publish a new course to the
              platform.
            </DialogDescription>
          </DialogHeader>
        </div>

        <CreateCourseForm
          formik={formik}
          categories={categories}
          levels={levels}
          teachersList={teachersList}
          isLoadingTeachers={isLoadingTeachers}
          isPending={mutation.isPending}
          onCancel={() => {
            formik.resetForm();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
