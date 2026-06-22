import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { MappedComment } from "@/core/services/api/Get/GetAllCommentAdmin";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ViewCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: MappedComment;
}

export function ViewCommentModal({
  isOpen,
  onClose,
  comment,
}: ViewCommentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            Comment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-full bg-slate-100">
                <Image
                  src={comment.userImage}
                  alt={comment.userName}
                  fill
                  className="rounded-full object-cover shadow-sm border border-slate-200 dark:border-[#555]"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                  {comment.userName}
                </h4>
                <p className="text-sm text-slate-500 dark:text-[#898989]">
                  {comment.date}
                </p>
              </div>
            </div>

            <Badge
              className={cn(
                "rounded-full px-3 py-1 font-normal",
                comment.isConfirmed
                  ? "!bg-emerald-100 !text-emerald-700 dark:!bg-emerald-500/20 dark:!text-emerald-400"
                  : "!bg-amber-100 !text-amber-400 dark:!bg-amber-500/20 dark:!text-amber-400",
              )}
            >
              {comment.isConfirmed ? "Confirmed" : "Pending"}
            </Badge>
          </div>

          <div className="bg-slate-50 dark:bg-[#3a3a3a] rounded-2xl p-5 border border-slate-100 dark:border-[#444]">
            <div className="mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-[#898989] uppercase tracking-wider">
                Course:
              </span>
              <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mt-1">
                {comment.courseTitle}
              </p>
            </div>

            <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-slate-700 dark:text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
