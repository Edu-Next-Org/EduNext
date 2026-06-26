"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createExamAdmin } from "@/core/services/api/post/CreateExam";
import {
  updateExamAdmin,
  UpdateExamPayload,
} from "@/core/services/api/put/UpdateExam";

export type InitialExamData = {
  _id: string;
  title: string;
  passingScore: number;
  timeLimit: number;
};

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialExamData | null;
  courseId: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Exam title is required"),
  passingScore: Yup.number()
    .min(0, "Score cannot be negative")
    .required("Passing score is required"),
  timeLimit: Yup.number()
    .min(1, "Time limit must be at least 1 minute")
    .required("Time limit is required"),
});

export function ExamFormModal({
  isOpen,
  onClose,
  initialData,
  courseId,
}: ExamFormModalProps) {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createExamAdmin,
    onSuccess: () => {
      toast.success("Exam created successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExamPayload }) =>
      updateExamAdmin(id, payload),
    onSuccess: () => {
      toast.success("Exam updated successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      title: "",
      passingScore: "" as number | string,
      timeLimit: "" as number | string,
    },
    validationSchema,
    onSubmit: (values) => {
      if (initialData) {
        updateMutation.mutate({
          id: initialData._id,
          payload: {
            title: values.title,
            passingScore: Number(values.passingScore),
            timeLimit: Number(values.timeLimit),
          },
        });
      } else {
        if (!courseId) {
          toast.error("Course ID is missing!");
          return;
        }
        createMutation.mutate({
          course: courseId,
          title: values.title,
          passingScore: Number(values.passingScore),
          timeLimit: Number(values.timeLimit),
        });
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        formik.setValues({
          title: initialData.title,
          passingScore: initialData.passingScore,
          timeLimit: initialData.timeLimit,
        });
      } else {
        formik.resetForm();
      }
    }
  }, [initialData, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!isPending && !open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {initialData ? "Edit Exam" : "Create New Exam"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-[#ccc]">
              Exam Title
            </Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isPending}
              placeholder="e.g. Final Exam"
              className={`rounded-2xl dark:bg-[#2a2a2a] ${
                formik.touched.title && formik.errors.title
                  ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  : "dark:border-[#555]"
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-rose-500">{formik.errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-[#ccc]">
                Passing Score
              </Label>
              <Input
                name="passingScore"
                type="number"
                value={formik.values.passingScore}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isPending}
                placeholder="e.g. 90"
                className={`rounded-2xl dark:bg-[#2a2a2a] ${
                  formik.touched.passingScore && formik.errors.passingScore
                    ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    : "dark:border-[#555]"
                }`}
              />
              {formik.touched.passingScore && formik.errors.passingScore && (
                <p className="text-xs text-rose-500">
                  {formik.errors.passingScore}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-[#ccc]">
                Time Limit (Mins)
              </Label>
              <Input
                name="timeLimit"
                type="number"
                value={formik.values.timeLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isPending}
                placeholder="e.g. 30"
                className={`rounded-2xl dark:bg-[#2a2a2a] ${
                  formik.touched.timeLimit && formik.errors.timeLimit
                    ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    : "dark:border-[#555]"
                }`}
              />
              {formik.touched.timeLimit && formik.errors.timeLimit && (
                <p className="text-xs text-rose-500">
                  {formik.errors.timeLimit}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer rounded-2xl dark:text-white dark:border-[#555] hover:dark:bg-[#444]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-violet-600 hover:bg-violet-700 text-white cursor-pointer disabled:opacity-70"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Create Exam"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
