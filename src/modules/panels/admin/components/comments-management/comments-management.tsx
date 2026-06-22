"use client";

import { motion } from "framer-motion";
import { Search, MoreHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PaginationComp } from "@/components/PaginationComp";
import { ViewCommentModal } from "./modals/ViewCommentModal";
import { DeleteCommentModal } from "./modals/DeleteCommentModal";
import { ConfirmCommentModal } from "./modals/ConfirmCommentModal";
import { ViewReplyCommentModal } from "./modals/ViewReplyCommentModal";
import loading from "@/assets/Lottie/Loader.json";
import Empty from "@/assets/Lottie/Empty.json";
import { useMutation } from "@tanstack/react-query";
import { deleteCommentAdmin } from "@/core/services/api/delete/DeleteComment";
import { confirmCommentAdmin } from "@/core/services/api/patch/ConfirmComment";
import type { MappedReply } from "@/core/services/api/Get/GetReplyCommentAdmin";
import { toast } from "sonner";
import type { MappedComment } from "@/core/services/api/Get/GetAllCommentAdmin";
import type { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import Lottie from "lottie-react";

interface CommentsManagementProps {
  comments: MappedComment[];
  meta: { totalPages: number; page: number };
  courses: AdminCourse[];
  repliesRecord: Record<string, MappedReply[]>;
}

export function CommentsManagement({
  comments,
  meta,
  courses,
  repliesRecord,
}: CommentsManagementProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const tableTopRef = useRef<HTMLDivElement>(null);

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentCourse = searchParams.get("courseId") || "all-courses";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [selectedComment, setSelectedComment] = useState<MappedComment | null>(
    null,
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "all-courses") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      if (!updates.page) {
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  const handlePageChange = (page: number) => {
    tableTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    startTransition(() => {
      router.push(
        `${pathname}?${new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          page: page.toString(),
        }).toString()}`,
        {
          scroll: false,
        },
      );
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateFilters({ search: searchTerm, page: "1" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentSearch, updateFilters]);

  const openActionModal = (
    comment: MappedComment,
    action: "view" | "delete" | "confirm" | "reply",
  ) => {
    setSelectedComment(comment);
    if (action === "view") setIsViewModalOpen(true);
    if (action === "delete") setIsDeleteModalOpen(true);
    if (action === "confirm") setIsConfirmModalOpen(true);
    if (action === "reply") setIsReplyModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentAdmin(commentId),
    onSuccess: (data) => {
      toast.success(data.message || "Comment deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedComment(null);

      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (commentId: string) => confirmCommentAdmin(commentId),
    onSuccess: (data) => {
      toast.success(data.message || "Comment confirmed successfully");
      setIsConfirmModalOpen(false);
      setSelectedComment(null);

      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
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

        <Card
          ref={tableTopRef}
          className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333] relative overflow-hidden"
        >
          <CardContent
            className={cn("space-y-4 transition-opacity duration-300")}
          >
            <div className="mt-7 grid gap-5 md:gap-3 md:grid-cols-2 lg:grid-cols-12">
              <div className="relative lg:col-span-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="rounded-2xl py-5 pl-10"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center justify-between md:justify-start md:gap-3 lg:col-span-7">
                <Select
                  value={currentStatus}
                  onValueChange={(val) => updateFilters({ status: val })}
                >
                  <SelectTrigger className="rounded-2xl py-5 w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Comments</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={currentCourse}
                  onValueChange={(val) => updateFilters({ courseId: val })}
                >
                  <SelectTrigger className="rounded-2xl py-5 w-[200px]">
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-courses">All Courses</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="hidden overflow-x-auto xl:block min-h-[400px]">
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
                            <DropdownMenuContent
                              align="end"
                              className="rounded-2xl"
                            >
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => openActionModal(comment, "view")}
                              >
                                View Comment
                              </DropdownMenuItem>
                              {!comment.isConfirmed && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openActionModal(comment, "confirm")
                                  }
                                  className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                >
                                  Confirm Comment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  openActionModal(comment, "reply")
                                }
                              >
                                View Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  openActionModal(comment, "delete")
                                }
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
                            View
                          </DropdownMenuItem>

                          {!comment.isConfirmed && (
                            <DropdownMenuItem
                              onClick={() =>
                                openActionModal(comment, "confirm")
                              }
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
                  <Lottie
                    style={{ width: 200, height: 200 }}
                    animationData={Empty}
                  />
                  <p>No comment found</p>
                </div>
              )}
            </div>
          </CardContent>

          {meta.totalPages > 1 && (
            <div
              className={cn(
                "transition-opacity",
                isPending && "opacity-40 pointer-events-none",
              )}
            >
              <PaginationComp
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
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
              replies={repliesRecord[selectedComment.id] || []}
            />
            <ConfirmCommentModal
              isOpen={isConfirmModalOpen}
              onClose={() => {
                if (!confirmMutation.isPending) {
                  setIsConfirmModalOpen(false);
                }
              }}
              onConfirm={() => {
                if (selectedComment) {
                  confirmMutation.mutate(selectedComment.id);
                }
              }}
              isPending={confirmMutation.isPending}
            />
            <DeleteCommentModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                if (!deleteMutation.isPending) {
                  setIsDeleteModalOpen(false);
                }
              }}
              onConfirm={() => {
                if (selectedComment) {
                  deleteMutation.mutate(selectedComment.id);
                }
              }}
              isPending={deleteMutation.isPending}
            />
          </>
        )}
      </motion.div>

      {isPending && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md dark:bg-[#111]/60 transition-all">
          <div className="w-50 h-50">
            <Lottie animationData={loading} loop={true} />
          </div>
          <p className="ml-3 animate-pulse text-sm font-semibold tracking-widest text-violet-600 dark:text-violet-400">
            LOADING ...
          </p>
        </div>
      )}
    </>
  );
}
