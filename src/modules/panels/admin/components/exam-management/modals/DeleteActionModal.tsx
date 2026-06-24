"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { deleteExamAdmin } from "@/core/services/api/delete/DeleteExam";
import { deleteQuestionAdmin } from "@/core/services/api/delete/DeleteQuestion";
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

interface DeleteActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "exam" | "question";
  targetId: string;
}

export function DeleteActionModal({
  isOpen,
  onClose,
  type,
  targetId,
}: DeleteActionModalProps) {
  const router = useRouter();
  const isExam = type === "exam";

  const deleteExamMutation = useMutation({
    mutationFn: (id: string) => deleteExamAdmin(id),
    onSuccess: () => {
      toast.success("Exam deleted successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestionAdmin(id),
    onSuccess: () => {
      toast.success("Question deleted successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isPending = isExam
    ? deleteExamMutation.isPending
    : deleteQuestionMutation.isPending;

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!targetId) {
      return toast.error(
        isExam ? "Exam ID is missing" : "Question ID is missing",
      );
    }

    if (isExam) {
      deleteExamMutation.mutate(targetId);
    } else {
      deleteQuestionMutation.mutate(targetId);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !isPending && !open && onClose()}
    >
      <AlertDialogContent className="rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444] sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
            <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Delete {isExam ? "Exam" : "Question"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-[#ccc] mt-2">
            {isExam
              ? "Are you sure you want to delete this entire exam? All associated questions will be permanently lost."
              : "Are you sure you want to delete this question?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-2xl cursor-pointer"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className=" cursor-pointer rounded-2xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
