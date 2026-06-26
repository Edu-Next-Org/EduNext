"use client";

import { motion } from "framer-motion";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PaginationComp } from "@/components/PaginationComp";
import { ViewCommentModal } from "./modals/ViewCommentModal";
import { DeleteCommentModal } from "./modals/DeleteCommentModal";
import { ConfirmCommentModal } from "./modals/ConfirmCommentModal";
import { ViewReplyCommentModal } from "./modals/ViewReplyCommentModal";
import loading from "@/assets/Lottie/Loader.json";
import { useMutation } from "@tanstack/react-query";
import { deleteCommentAdmin } from "@/core/services/api/delete/DeleteComment";
import { confirmCommentAdmin } from "@/core/services/api/patch/ConfirmComment";
import type { MappedReply } from "@/core/services/api/Get/GetReplyCommentAdmin";
import { toast } from "sonner";
import type { MappedComment } from "@/core/services/api/Get/GetAllCommentAdmin";
import type { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import Lottie from "lottie-react";

import { CommentManagementDesktop } from "./comments-management-desktop";
import { CommentManagementMobile } from "./comments-management-mobile";

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

            <CommentManagementDesktop
              comments={comments}
              openActionModal={openActionModal}
            />

            <CommentManagementMobile
              comments={comments}
              openActionModal={openActionModal}
            />
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
