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
import { CheckCircle, Loader2 } from "lucide-react";

interface ConfirmCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ConfirmCommentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: ConfirmCommentModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444] sm:max-w-md">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold dark:text-white">
            Confirm Comment
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-[#ccc] mt-2">
            Are you sure you want to approve this comment? Once confirmed, it
            will be visible publicly on the course page.
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
            className=" cursor-pointer rounded-2xl bg-emerald-600 hover:!bg-emerald-700 text-white flex items-center justify-center disabled:opacity-70"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className=" h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Yes, Confirm"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
