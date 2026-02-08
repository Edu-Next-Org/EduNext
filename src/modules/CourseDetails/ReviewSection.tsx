"use client";

import React from "react";
import Image from "next/image";
import ReplyButton from "@/modules/CourseDetails/ReplyButton";
import { useQuery } from "@tanstack/react-query";
import { getCourseComments } from "@/core/services/api/get/getCourseComments";

interface ReviewSectionProps {
  courseId: string;
  isChild?: boolean;
}

export default function ReviewSection({
  courseId,
  isChild = false,
}: ReviewSectionProps) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", courseId],
    queryFn: () => getCourseComments(courseId),
    enabled: !!courseId,
  });

  if (isLoading && !isChild)
    return (
      <div className="text-center py-10 dark:text-white">
        Loading reviews...
      </div>
    );

  if (!comments || comments.length === 0) {
    return !isChild ? (
      <div className="mt-10 dark:text-gray-400">
        No reviews yet. Be the first to comment!
      </div>
    ) : null;
  }

  return (
    <div
      className={`${isChild ? "mt-4 ml-6 md:ml-10 border-l-2 border-gray-100 dark:border-gray-800 pl-4" : "mt-10 lg:mt-0"}`}
    >
      {!isChild && (
        <h2 className="text-2xl font-bold mb-6 dark:text-[white]">
          Student Reviews
        </h2>
      )}

      <div
        className={`${isChild ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}`}
      >
        {comments.map((comment) => (
          <div key={comment._id} className="flex flex-col">
            <div className="bg-white dark:bg-[#333] p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <Image
                src={"https://i.pravatar.cc/150"}
                alt="User"
                width={64}
                height={64}
                className="rounded-full object-cover mb-3"
              />
              <div className="flex gap-1 text-[#898989] text-xs mb-2">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <h4 className="font-bold text-gray-900 dark:text-[white]">
                {comment.user.name || "Student"}
              </h4>

              <p className="text-gray-500 text-sm dark:text-[#898989]">
                {comment.content.length <= 25 ? (
                  comment.content
                ) : (
                  <>
                    <input
                      id={`toggle-${comment._id}`}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <span className="block peer-checked:hidden">
                      {comment.content.slice(0, 25)}...{" "}
                      <label
                        htmlFor={`toggle-${comment._id}`}
                        className="underline cursor-pointer text-purple-400 "
                      >
                        More
                      </label>
                    </span>
                    <span className="hidden peer-checked:block">
                      {comment.content}{" "}
                      <label
                        htmlFor={`toggle-${comment._id}`}
                        className="underline cursor-pointer text-purple-400"
                      >
                        Less
                      </label>
                    </span>
                  </>
                )}
              </p>

              <ReplyButton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
