"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReplyFormValues {
  message: string;
}

interface Answer {
  id: number;
  user: string;
  avatarUrl?: string;
  date: string;
  message: string;
}

const MOCK_ANSWERS: Answer[] = [
  {
    id: 1,
    user: "Ali Rezaei",
    date: "2 hours ago",
    message:
      "This is a great point! I totally agree with your perspective regarding the frontend architecture.",
  },
  {
    id: 2,
    user: "Sarah Jones",
    date: "5 hours ago",
    message:
      "Could you elaborate more on the second paragraph? It seems a bit ambiguous.",
  },
  {
    id: 3,
    user: "Mike Ross",
    date: "1 day ago",
    message:
      "Thanks for sharing. This helped me solve my issue with Next.js routing.",
  },
  {
    id: 4,
    user: "Emily Blunt",
    date: "2 days ago",
    message:
      "Just a quick correction: strictly strictly speaking, useLayoutEffect runs synchronously.",
  },
  {
    id: 5,
    user: "Emily Blunt",
    date: "2 days ago",
    message:
      "Just a quick correction: strictly strictly speaking, useLayoutEffect runs synchronously.",
  },
  {
    id: 6,
    user: "Mike Ross",
    date: "1 day ago",
    message:
      "Thanks for sharing. This helped me solve my issue with Next.js routing.",
  },
  {
    id: 7,
    user: "Emily Blunt",
    date: "2 days ago",
    message:
      "Just a quick correction: strictly strictly speaking, useLayoutEffect runs synchronously.",
  },
  {
    id: 8,
    user: "Emily Blunt",
    date: "2 days ago",
    message:
      "Just a quick correction: strictly strictly speaking, useLayoutEffect runs synchronously.",
  },
  {
    id: 9,
    user: "Mike Ross",
    date: "1 day ago",
    message:
      "Thanks for sharing. This helped me solve my issue with Next.js routing.",
  },
];

const ReplySchema = Yup.object().shape({
  message: Yup.string()
    .required("This field is required")
    .min(3, "Message must be at least 3 characters"),
});

export default function CommentActions() {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  const handleSubmitReply = (
    values: ReplyFormValues,
    { resetForm }: FormikHelpers<ReplyFormValues>,
  ) => {
    console.log(values.message);

    setTimeout(() => {
      resetForm();
      setIsReplyOpen(false);
    }, 500);
  };

  return (
    <div className="w-full mt-3 flex items-center justify-between px-2">
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

      <Dialog open={isAnswersOpen} onOpenChange={setIsAnswersOpen}>
        <DialogTrigger asChild>
          <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer transition-colors">
            Answers ({MOCK_ANSWERS.length})
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden dark:bg-[#1e1e1e]">
          <DialogHeader className="p-6 border-b dark:border-gray-700">
            <DialogTitle>All Answers</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 w-full">
            <div className="p-6 flex flex-col gap-6">
              {MOCK_ANSWERS.map((answer) => (
                <div key={answer.id} className="flex gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${answer.user}&background=644DB3&color=fff`}
                    className="w-11 h-11 rounded-full mt-7"
                    alt="avatar"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm dark:text-white">
                        {answer.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {answer.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] p-3 rounded-lg">
                      {answer.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-[#252525] flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsAnswersOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
