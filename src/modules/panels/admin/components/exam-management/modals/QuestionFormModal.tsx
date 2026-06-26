"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createQuestionAdmin } from "@/core/services/api/post/CreateQuestion";
import {
  updateQuestionAdmin,
  UpdateQuestionPayload,
} from "@/core/services/api/put/UpdateQuestion";

export type InitialQuestionData = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InitialQuestionData | null;
  examId: string;
}

const validationSchema = Yup.object({
  text: Yup.string()
    .min(3, "Question text must be at least 3 characters")
    .required("Question text is required"),
  options: Yup.array()
    .of(Yup.string().trim().required("Option cannot be empty"))
    .min(4, "Exactly 4 options are required")
    .max(4, "Exactly 4 options are required"),
  correctIndex: Yup.string().required("Please select the correct answer"),
});

export function QuestionFormModal({
  isOpen,
  onClose,
  initialData,
  examId,
}: QuestionFormModalProps) {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createQuestionAdmin,
    onSuccess: () => {
      toast.success("Question added successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionPayload;
    }) => updateQuestionAdmin(id, payload),
    onSuccess: () => {
      toast.success("Question updated successfully");
      onClose();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      text: "",
      options: ["", "", "", ""],
      correctIndex: "0",
    },
    validationSchema,
    onSubmit: (values) => {
      const correctAnswer = values.options[parseInt(values.correctIndex)];

      if (initialData) {
        updateMutation.mutate({
          id: initialData._id,
          payload: {
            text: values.text,
            options: values.options,
            correctAnswer,
          },
        });
      } else {
        if (!examId) {
          toast.error("Exam ID is missing");
          return;
        }

        createMutation.mutate({
          examId,
          questions: [
            {
              text: values.text,
              options: values.options,
              correctAnswer,
            },
          ],
        });
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const paddedOptions = [...initialData.options];
        while (paddedOptions.length < 4) paddedOptions.push("");

        const finalOptions = paddedOptions.slice(0, 4);
        const cIndex = initialData.options.indexOf(initialData.correctAnswer);

        formik.setValues({
          text: initialData.text,
          options: finalOptions,
          correctIndex: cIndex !== -1 ? cIndex.toString() : "0",
        });
      } else {
        formik.resetForm();
      }
    }
  }, [initialData, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!isPending && !open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl dark:bg-[#333] border-slate-200 dark:border-[#444]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {initialData ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-[#ccc]">
              Question Text
            </Label>
            <Textarea
              name="text"
              value={formik.values.text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isPending}
              placeholder="Type the question here..."
              className={`rounded-2xl resize-none dark:bg-[#2a2a2a] min-h-[80px] ${
                formik.touched.text && formik.errors.text
                  ? "border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  : "dark:border-[#555]"
              }`}
            />
            {formik.touched.text && formik.errors.text && (
              <p className="text-xs text-rose-500">{formik.errors.text}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-[#ccc]">
              Options & Correct Answer
            </Label>
            <p className="text-xs text-slate-500 dark:text-[#898989] mb-2">
              Fill in the options and select the radio button next to the
              correct answer.
            </p>
            <RadioGroup
              name="correctIndex"
              value={formik.values.correctIndex}
              onValueChange={(val) => formik.setFieldValue("correctIndex", val)}
              disabled={isPending}
              className="space-y-3"
            >
              {formik.values.options.map((opt, index) => {
                const optionError =
                  formik.touched.options &&
                  formik.errors.options &&
                  formik.errors.options[index]
                    ? formik.errors.options[index]
                    : null;

                return (
                  <div key={index} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className="border-violet-500 text-violet-600"
                      />
                      <Input
                        name={`options[${index}]`}
                        value={opt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isPending}
                        placeholder={`Option ${index + 1}`}
                        className={`rounded-xl dark:bg-[#2a2a2a] ${
                          optionError
                            ? "border-rose-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                            : formik.values.correctIndex === index.toString()
                              ? "border-violet-400 ring-1 ring-violet-400 dark:border-violet-500 dark:ring-violet-500"
                              : "dark:border-[#555]"
                        }`}
                      />
                    </div>
                    {optionError && typeof optionError === "string" && (
                      <p className="text-xs text-rose-500 ml-8">
                        {optionError}
                      </p>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
            {formik.touched.correctIndex && formik.errors.correctIndex && (
              <p className="text-xs text-rose-500">
                {formik.errors.correctIndex}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className=" cursor-pointer rounded-2xl dark:text-white dark:border-[#555] hover:dark:bg-[#444]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className=" cursor-pointer rounded-2xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Question"
              ) : (
                "Create Question"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
