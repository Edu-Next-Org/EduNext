"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCourse } from "@/core/services/api/delete/DeleteCourse";
import { Loader2 } from "lucide-react";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
  courseTitle: string;
}

export function DeleteCourseModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: DeleteCourseModalProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!courseId) {
        throw new Error("Course ID is missing");
      }
      return deleteCourse(courseId);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Course deleted successfully");
      onClose();
      router.refresh();
    },
    onError: (error: unknown) => {
      let message = "Failed to delete course";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border-white/70 dark:bg-[#333]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-[#ccc]">
            This will delete the course{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              &quot;{courseTitle}&quot;
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-2xl" disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            className="rounded-2xl bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
