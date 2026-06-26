"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";
import type { MappedComment } from "@/core/services/api/Get/GetAllCommentAdmin";

interface CommentManagementMobileProps {
  comments: MappedComment[];
  openActionModal: (
    comment: MappedComment,
    action: "view" | "delete" | "confirm" | "reply",
  ) => void;
}

export function CommentManagementMobile({
  comments,
  openActionModal,
}: CommentManagementMobileProps) {
  return (
    <div className="space-y-4 xl:hidden py-5">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 items-center">
                <div className="relative h-12 w-12 shrink-0 rounded-full">
                  <Image
                    src={comment.userImage}
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover dark:bg-[#ccc]"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {comment.userName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#898989]">
                    {comment.date}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4 dark:text-white" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem
                    onClick={() => openActionModal(comment, "view")}
                  >
                    View
                  </DropdownMenuItem>

                  {!comment.isConfirmed && (
                    <DropdownMenuItem
                      onClick={() => openActionModal(comment, "confirm")}
                      className="text-emerald-600 dark:text-emerald-400"
                    >
                      Confirm
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => openActionModal(comment, "reply")}
                  >
                    View Reply
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => openActionModal(comment, "delete")}
                    className="text-rose-600 dark:text-rose-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-sm text-slate-700 dark:text-[#ccc] line-clamp-2">
                {comment.content}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Badge variant="secondary" className="rounded-full">
                  {comment.courseTitle}
                </Badge>

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
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
          <Lottie style={{ width: 200, height: 200 }} animationData={Empty} />
          <p>No comment found</p>
        </div>
      )}
    </div>
  );
}
