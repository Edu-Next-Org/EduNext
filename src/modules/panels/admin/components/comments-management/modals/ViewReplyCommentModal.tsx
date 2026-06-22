import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, CornerDownRight, Quote, MessageSquare } from "lucide-react";
import Image from "next/image";
import Empty from "@/assets/Lottie/Empty.json";
import { DeleteCommentModal } from "./DeleteCommentModal";
import type { MappedComment } from "@/core/services/api/Get/GetAllCommentAdmin";
import type { MappedReply } from "@/core/services/api/Get/GetReplyCommentAdmin";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteReplyAdmin } from "@/core/services/api/delete/DeleteReplyComment";
import Lottie from "lottie-react";

interface ViewReplyCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: MappedComment;
  replies: MappedReply[];
}

export function ViewReplyCommentModal({
  isOpen,
  onClose,
  comment,
  replies,
}: ViewReplyCommentModalProps) {
  const router = useRouter();
  const [isDeleteReplyAlertOpen, setIsDeleteReplyAlertOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);

  const deleteReplyMutation = useMutation({
    mutationFn: ({ cId, rId }: { cId: string; rId: string }) =>
      deleteReplyAdmin(cId, rId),
    onSuccess: (data) => {
      toast.success(data.message || "Reply deleted successfully");
      setIsDeleteReplyAlertOpen(false);
      setSelectedReplyId(null);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteReply = () => {
    if (selectedReplyId) {
      deleteReplyMutation.mutate({
        cId: comment.id,
        rId: selectedReplyId,
      });
    }
  };

  const openDeleteModal = (replyId: string) => {
    setSelectedReplyId(replyId);
    setIsDeleteReplyAlertOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444] max-h-[85vh] p-0 gap-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#444] shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold dark:text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500 dark:bg-violet-500/10">
                <MessageSquare className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                Reply Thread
                <span className="text-xs font-normal text-slate-500 dark:text-[#898989]">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}{" "}
                  on this comment
                </span>
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-5">
            <div className="relative bg-slate-50 dark:bg-[#3a3a3a] p-4 rounded-2xl border border-slate-100 dark:border-[#444]">
              <Quote className="absolute top-4 right-4 h-4 w-4 text-slate-300 dark:text-[#555]" />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-[#898989] mb-2">
                Original comment · {comment.userName}
              </p>
              <p className="text-sm text-slate-600 dark:text-[#ccc] italic leading-relaxed line-clamp-3 pr-6">
                &quot;{comment.content}&quot;
              </p>
            </div>

            {replies.length > 0 ? (
              <div>
                {replies.map((reply, index) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500 dark:bg-violet-500/10 ring-1 ring-violet-100 dark:ring-violet-500/20">
                        <CornerDownRight className="h-4 w-4" />
                      </span>
                      {index !== replies.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-violet-100 dark:bg-violet-500/20" />
                      )}
                    </div>

                    <div className="flex-1 pb-5">
                      <div className="group rounded-2xl border border-slate-100 dark:border-[#444] bg-white dark:bg-[#3a3a3a] p-4 transition-all duration-200 hover:border-violet-200 hover:shadow-sm dark:hover:border-violet-500/30">
                        <div className="flex items-start gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white dark:ring-[#3a3a3a]">
                            <Image
                              src={reply.userImage}
                              alt={reply.userName}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="truncate font-semibold text-sm text-slate-900 dark:text-white">
                                {reply.userName}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer h-8 w-8 shrink-0 text-rose-500 opacity-60 transition-opacity hover:text-rose-600 hover:bg-rose-50 hover:opacity-100 group-hover:opacity-100 dark:hover:bg-rose-500/20 rounded-full"
                                onClick={() => openDeleteModal(reply.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-[#898989] mb-1.5">
                              Replied on {reply.date}
                            </p>
                            <p className="text-slate-700 dark:text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-[#444] py-8 text-center text-slate-500 dark:text-[#aaa]">
                <Lottie
                  style={{ width: 180, height: 180 }}
                  animationData={Empty}
                />
                <p className="text-sm">No reply found for this comment</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteCommentModal
        isOpen={isDeleteReplyAlertOpen}
        onClose={() => {
          if (!deleteReplyMutation.isPending) {
            setIsDeleteReplyAlertOpen(false);
            setSelectedReplyId(null);
          }
        }}
        onConfirm={handleDeleteReply}
        isReply={true}
        isPending={deleteReplyMutation.isPending}
      />
    </>
  );
}
