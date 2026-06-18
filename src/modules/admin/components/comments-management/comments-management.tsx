"use client";

import { motion } from "framer-motion";
import { Search, MoreHorizontal, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminComment } from "../../data/mock";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { PaginationComp } from "@/components/PaginationComp";

import { ViewCommentModal } from "./modals/ViewCommentModal";
import { DeleteCommentModal } from "./modals/DeleteCommentModal";
import { ConfirmCommentModal } from "./modals/ConfirmCommentModal";
import { ViewReplyCommentModal } from "./modals/ViewReplyCommentModal";

export function CommentsManagement({ comments }: { comments: AdminComment[] }) {
  const [selectedComment, setSelectedComment] = useState<AdminComment | null>(
    null,
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const openActionModal = (
    comment: AdminComment,
    action: "view" | "delete" | "confirm" | "reply",
  ) => {
    setSelectedComment(comment);
    if (action === "view") setIsViewModalOpen(true);
    if (action === "delete") setIsDeleteModalOpen(true);
    if (action === "confirm") setIsConfirmModalOpen(true);
    if (action === "reply") setIsReplyModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight dark:text-[white]">
            Comments Management
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc]">
            Review, confirm, or remove student comments across all courses.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]">
        <CardContent className="space-y-4">
          <div className="mt-7 grid gap-5 md:gap-3 md:grid-cols-2 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="rounded-2xl py-5 pl-10"
                placeholder="Search comments or users..."
              />
            </div>
            <div className="flex flex-row items-center justify-between md:justify-start md:gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="rounded-2xl py-5">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-courses">
                <SelectTrigger className="rounded-2xl py-5">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-courses">All Courses</SelectItem>
                  <SelectItem value="react">React Masterclass</SelectItem>
                  <SelectItem value="node">Node Backend Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden overflow-x-auto xl:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
                <tr>
                  <th className="px-10 py-4 font-medium dark:text-[#ccc]">
                    User
                  </th>
                  <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                    Course
                  </th>
                  <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                    Comment
                  </th>
                  <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                    Status
                  </th>
                  <th className="px-4 py-4 font-medium dark:text-[#ccc]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-b border-slate-100 dark:border-[#444]/50"
                  >
                    <td className="px-4 py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800">
                          <Image
                            src={
                              comment.userImage ||
                              "/images/avatar-placeholder.png"
                            }
                            alt={comment.userName}
                            fill
                            className="rounded-full object-cover border border-slate-200 dark:border-[#555]"
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
                            className="rounded-xl"
                          >
                            <MoreHorizontal className="h-4 w-4 dark:text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl"
                        >
                          <DropdownMenuItem
                            onClick={() => openActionModal(comment, "view")}
                          >
                            View Comment
                          </DropdownMenuItem>
                          {!comment.isConfirmed && (
                            <DropdownMenuItem
                              onClick={() =>
                                openActionModal(comment, "confirm")
                              }
                              className="text-emerald-600 dark:text-emerald-400"
                            >
                              Confirm Comment
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
                            Delete Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 xl:hidden py-5">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="relative h-12 w-12 shrink-0 rounded-full bg-slate-100">
                      <Image
                        src={comment.userImage}
                        alt="User Avatar"
                        fill
                        className="rounded-full object-cover"
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
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
            ))}
          </div>
        </CardContent>
        <PaginationComp />
      </Card>

      {selectedComment && (
        <>
          <ViewCommentModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            comment={selectedComment}
          />
          <ViewReplyCommentModal
            isOpen={isReplyModalOpen}
            onClose={() => setIsReplyModalOpen(false)}
            comment={selectedComment}
          />
          <ConfirmCommentModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={() => {
              setIsConfirmModalOpen(false);
            }}
          />
          <DeleteCommentModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              setIsDeleteModalOpen(false);
            }}
          />
        </>
      )}
    </motion.div>
  );
}
