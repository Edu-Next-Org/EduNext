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
import { Trash2 } from "lucide-react";

interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isReply?: boolean;
}

export function DeleteCommentModal({
  isOpen,
  onClose,
  onConfirm,
  isReply = false,
}: DeleteCommentModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444] sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
            <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Delete {isReply ? "Reply" : "Comment"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-[#ccc] mt-2">
            Are you sure you want to delete this {isReply ? "reply" : "comment"}
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-2xl" onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white"
            onClick={onConfirm}
          >
            Yes, Delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
