"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createCommentReply } from "@/core/services/api/post/createCommentReply";
import { useQueryClient } from "@tanstack/react-query";

interface ReplyFormValues {
  message: string;
}

interface CreateReplyModalProps {
  commentId: string;
  courseId: string;
}

const ReplySchema = Yup.object().shape({
  message: Yup.string()
    .required("This field is required")
    .min(3, "Message must be at least 3 characters"),
});

export default function CreateReplyModal({
  commentId,
  courseId,
}: CreateReplyModalProps) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmitReply = async (
    values: ReplyFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ReplyFormValues>,
  ) => {
    try {
      await createCommentReply({
        commentId,
        courseId,
        content: values.message,
      });

      await queryClient.invalidateQueries({
        queryKey: ["replies", commentId],
      });

      toast.success("Your reply was submitted successfully");

      resetForm();
      setIsReplyOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit reply.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
      <DialogTrigger asChild>
        <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer transition-colors">
          Reply
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] dark:bg-[#1e1e1e] border dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold dark:text-white">
            Write a Reply
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Share your thoughts respectfully. Click send when youre done.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{ message: "" }}
          validationSchema={ReplySchema}
          onSubmit={handleSubmitReply}
        >
          {({ errors, touched, resetForm, isSubmitting }) => {
            const hasError = errors.message && touched.message;
            return (
              <Form className="grid gap-4 py-4">
                <div className="grid w-full gap-2 relative pb-4">
                  <Label
                    htmlFor="message"
                    className="font-semibold dark:text-gray-300"
                  >
                    Your Message
                  </Label>

                  <Field
                    as={Textarea}
                    id="message"
                    name="message"
                    placeholder="Type your reply here..."
                    className={`
                      resize-none h-32 transition-all duration-200
                      bg-white dark:bg-[#2a2a2a] dark:text-gray-100
                      focus-visible:ring-offset-0
                      ${
                        hasError
                          ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/30"
                      }
                    `}
                  />
                  {hasError && (
                    <div className="absolute -bottom-1 left-0 text-[11px] text-red-500 font-medium animate-in slide-in-from-top-1 fade-in">
                      {errors.message}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsReplyOpen(false);
                    }}
                    className="dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
                  >
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
