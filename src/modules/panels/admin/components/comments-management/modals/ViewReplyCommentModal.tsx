import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, CornerDownRight } from "lucide-react";
import type { AdminComment } from "../../../data/mock";
import Image from "next/image";
import { DeleteCommentModal } from "./DeleteCommentModal";

interface ViewReplyCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: AdminComment;
}

export function ViewReplyCommentModal({
  isOpen,
  onClose,
  comment,
}: ViewReplyCommentModalProps) {
  const [isDeleteReplyAlertOpen, setIsDeleteReplyAlertOpen] = useState(false);

  const mockReply = {
    content:
      "Thank you for your feedback! We will definitely add more examples on JWT in the upcoming sections.",
    date: "2026-06-02",
    userName: "Admin (You)",
    userImage: "/images/HTML5Course.png",
  };

  const handleDeleteReply = () => {
    setIsDeleteReplyAlertOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold dark:text-white">
              Reply Thread
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 dark:bg-[#3a3a3a] p-4 rounded-2xl border border-slate-100 dark:border-[#444] opacity-80">
              <p className="text-xs font-semibold text-slate-500 mb-2 dark:text-[#898989]">
                Original Comment by {comment.userName}:
              </p>
              <p className="text-sm text-slate-600 dark:text-[#ccc] line-clamp-2 italic">
                &quot;{comment.content}&quot;
              </p>
            </div>

            <div className="flex gap-2 text-violet-500 pl-4">
              <CornerDownRight className="h-5 w-5" />
            </div>

            <div className="flex items-start justify-between gap-4 pl-4 border-l-2 border-violet-500 ml-6">
              <div className="flex gap-4">
                <div className="relative h-12 w-12 shrink-0 rounded-full bg-slate-100">
                  <Image
                    src={mockReply.userImage}
                    alt={mockReply.userName}
                    fill
                    className="rounded-full object-cover border border-slate-200 dark:border-[#555]"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {mockReply.userName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#898989] mb-3">
                    Replied on {mockReply.date}
                  </p>
                  <p className="text-slate-700 dark:text-[#ccc] text-sm leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                    {mockReply.content}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-100 dark:border-[#444]">
              <Button
                variant="destructive"
                className="rounded-2xl bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white"
                onClick={() => setIsDeleteReplyAlertOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteCommentModal
        isOpen={isDeleteReplyAlertOpen}
        onClose={() => setIsDeleteReplyAlertOpen(false)}
        onConfirm={handleDeleteReply}
        isReply={true}
      />
    </>
  );
}
