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

interface CommentManagementDesktopProps {
  comments: MappedComment[];
  openActionModal: (
    comment: MappedComment,
    action: "view" | "delete" | "confirm" | "reply",
  ) => void;
}

export function CommentManagementDesktop({
  comments,
  openActionModal,
}: CommentManagementDesktopProps) {
  return (
    <div className="hidden overflow-x-auto xl:block min-h-[400px]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
          <tr>
            <th className="px-10 py-4 font-medium dark:text-[#ccc]">User</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Course</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Comment</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Status</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <tr
                key={comment.id}
                className="border-b border-slate-100 dark:border-[#444]/50"
              >
                <td className="px-4 py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 rounded-full ">
                      <Image
                        src={comment.userImage}
                        alt={comment.userName}
                        fill
                        className="rounded-full object-cover dark:bg-[#ccc]"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-[white]">
                        {comment.userName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#898989]">
                        {comment.date}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium dark:text-[white]">
                    {comment.courseTitle}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[250px] truncate text-slate-600 dark:text-[#ccc]">
                    {comment.content}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge
                    className={cn(
                      "rounded-full px-3 py-1 font-normal",
                      comment.isConfirmed
                        ? "!bg-emerald-100 !text-emerald-700 dark:!bg-emerald-500/20 dark:!text-emerald-400 hover:!bg-emerald-200"
                        : "!bg-amber-100 !text-amber-400 dark:!bg-amber-500/20 dark:!text-amber-400 hover:!bg-amber-200",
                    )}
                  >
                    {comment.isConfirmed ? "Confirmed" : "Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4 dark:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openActionModal(comment, "view")}
                      >
                        View Comment
                      </DropdownMenuItem>
                      {!comment.isConfirmed && (
                        <DropdownMenuItem
                          onClick={() => openActionModal(comment, "confirm")}
                          className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                        >
                          Confirm Comment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openActionModal(comment, "reply")}
                      >
                        View Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openActionModal(comment, "delete")}
                        className="text-rose-600 dark:text-rose-400 cursor-pointer"
                      >
                        Delete Comment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-10 ">
                <div className="flex flex-col items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
                  <Lottie
                    style={{ width: 200, height: 200 }}
                    animationData={Empty}
                  />
                  <p>No comment found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
