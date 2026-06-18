"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCourseComment } from "@/core/services/api/post/addCourseComment";
import { toast } from "sonner";

interface FormValues {
  answer: string;
}

interface AddCommentProps {
  courseId: string;
}

const validationSchema = Yup.object({
  answer: Yup.string()
    .required("Answer is required")
    .min(5, "Answer must be at least 5 characters long"),
});

export default function AddComment({ courseId }: AddCommentProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (content: string) => addCourseComment({ courseId, content }),
    onSuccess: (data) => {
      toast.success(data.message || "Comment sent for review!");
      formik.resetForm();

      queryClient.invalidateQueries({ queryKey: ["comments", courseId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      answer: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values.answer);
    },
  });

  const hasError = formik.touched.answer && Boolean(formik.errors.answer);

  return (
    <div className="h-full bg-white dark:bg-[#333] rounded-2xl p-8 shadow-sm border dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Post an Answer
      </h2>

      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col">
        <div className="relative flex flex-col gap-2 mb-10">
          <label
            htmlFor="answer"
            className="text-lg font-semibold text-gray-700 dark:text-[#898989]"
          >
            Your Answer
          </label>

          <textarea
            id="answer"
            name="answer"
            placeholder="Type your answer here..."
            rows={5}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.answer}
            className={`
              w-full px-4 py-3 rounded-xl border-2 bg-transparent outline-none resize-none transition-all duration-200
              text-gray-700 dark:text-gray-200 placeholder:text-gray-400
              focus:ring-2 
              ${
                hasError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                  : "border-[#644DB3] focus:border-[#5B48AC] focus:ring-[#644DB3]/50"
              }
            `}
          />

          {hasError && (
            <span className="absolute -bottom-7 left-1 text-sm text-red-500 font-medium">
              {formik.errors.answer}
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className={`
            w-full text-white flex gap-2 items-center justify-center font-bold text-lg
            transition-all duration-300 transform active:scale-[0.98]
            bg-gradient-to-b from-[#644DB3] to-[#5B48AC] hover:shadow-lg hover:shadow-[#644DB3]/30
            ${mutation.isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {mutation.isPending ? "Submitting..." : "Submit Answer"}
        </Button>
      </form>
    </div>
  );
}
