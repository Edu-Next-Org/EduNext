"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetExamByCourse } from "@/core/services/api/Get/GetExam";
import { GetQuestionsByExam } from "@/core/services/api/Get/GetQuestion";
import {
  SubmitExam,
  SubmitExamPayload,
} from "@/core/services/api/post/SubmitExam";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";

interface ExamModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessPass: () => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onSuccessPass,
}) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  const answersRef = useRef<Record<string, string>>({});
  const deadlineRef = useRef<number | null>(null);
  const autoSubmittedRef = useRef(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const { data: examData, isLoading: isExamLoading } = useQuery({
    queryKey: ["exam", courseId],
    queryFn: () => GetExamByCourse(courseId),
    enabled: isOpen,
    staleTime: Infinity,
  });

  const examId = examData?._id;

  const { data: questions, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["questions", examId],
    queryFn: () => GetQuestionsByExam(examId as string),
    enabled: !!examId && isOpen,
    staleTime: Infinity,
  });

  const submitMutation = useMutation({
    mutationFn: SubmitExam,
    onSuccess: (response) => {
      submittingRef.current = false;

      if (response.data.attempt.isPassed) {
        toast.success("Exam submitted successfully! You passed the test", {
          icon: <CheckCircle2 className="text-green-500" />,
          className: "dark:bg-[#1e1e1e] dark:text-white border-green-500/20",
        });

        onSuccessPass();

        if (response.data.certificate?.code) {
          router.push(
            `/certificate?code=${encodeURIComponent(response.data.certificate.code)}`,
          );
        }
      } else {
        toast.error(
          "You did not pass the exam. Please review the course and try again",
          {
            icon: <AlertCircle className="text-red-500" />,
            className: "dark:bg-[#1e1e1e] dark:text-white border-red-500/20",
          },
        );
      }

      onClose();
    },
    onError: () => {
      submittingRef.current = false;
      toast.error("Something went wrong while submitting the exam.", {
        icon: <AlertCircle className="text-red-500" />,
        className: "dark:bg-[#1e1e1e] dark:text-white border-red-500/20",
      });
    },
  });

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  function handleSubmit(isAutoSubmitted = false) {
    if (submittingRef.current) return;
    if (!examId || !questions) return;

    const currentAnswers = answersRef.current;

    if (
      !isAutoSubmitted &&
      Object.keys(currentAnswers).length < questions.length
    ) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    submittingRef.current = true;

    const payload: SubmitExamPayload = {
      examId,
      isAutoSubmitted,
      answers: Object.entries(currentAnswers).map(([qId, ans]) => ({
        questionId: qId,
        answer: ans,
      })),
    };

    submitMutation.mutate(payload);
  }

  const isLoading = isExamLoading || isQuestionsLoading;

  useEffect(() => {
    if (!isOpen || !examData?.timeLimit || !deadlineRef.current) return;

    const tick = () => {
      const remaining = Math.max(
        Math.ceil((deadlineRef.current! - Date.now()) / 1000),
        0,
      );

      setTimeLeft(remaining);

      if (
        remaining === 0 &&
        !autoSubmittedRef.current &&
        !submittingRef.current
      ) {
        autoSubmittedRef.current = true;
        toast.info(
          "Your time is up. Your answers have been submitted automatically.",
        );
        handleSubmit(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [isOpen, examData?.timeLimit, examId, questions?.length]);

  useEffect(() => {
    if (!isOpen || !examData?.timeLimit) return;

    const totalSeconds = examData.timeLimit * 60;
    deadlineRef.current = Date.now() + totalSeconds * 1000;
    autoSubmittedRef.current = false;
    submittingRef.current = false;

    const resetId = window.setTimeout(() => {
      setAnswers({});
      setTimeLeft(totalSeconds);
    }, 0);

    return () => window.clearTimeout(resetId);
  }, [isOpen, examData?.timeLimit]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-[#1e1e1e]/95 dark:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-0">
        <DialogHeader className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#1e1e1e]">
          <DialogTitle className="text-2xl md:text-3xl font-extrabold text-[#1F1D43] dark:text-white tracking-tight">
            {isLoading
              ? "Loading Exam..."
              : (examData?.title ?? "Course Final Exam")}
          </DialogTitle>

          {!isLoading && examData && (
            <div className="flex flex-wrap gap-3 mt-2 text-sm font-medium text-gray-500 dark:text-[#898989]">
              <span
                className={`px-3 py-1 rounded-full ${
                  timeLeft <= 60
                    ? "bg-red-500/10 text-red-600 dark:text-red-300"
                    : "bg-[#644DB3]/10 text-[#644DB3] dark:text-violet-300"
                }`}
              >
                Time Left: {formatTime(timeLeft)}
              </span>

              <span className="bg-[#644DB3]/10 text-[#644DB3] dark:text-violet-300 px-3 py-1 rounded-full">
                Passing Score: {examData.passingScore}%
              </span>

              <span className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                Time Limit: {examData.timeLimit} min
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth dark:bg-[#1e1e1e] dark:bg-none bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#644DB3]" />
              <p className="font-medium text-gray-500 dark:text-gray-400">
                Preparing your questions...
              </p>
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-5">
                    <span className="text-[#644DB3] mr-2">{index + 1}.</span>{" "}
                    {q.text}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[q._id] === opt;
                      return (
                        <div
                          key={optIndex}
                          onClick={() => handleOptionSelect(q._id, opt)}
                          className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group ${isSelected ? "border-[#644DB3] bg-[#644DB3]/5 dark:bg-[#644DB3]/20" : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#644DB3]" : "border-gray-300 dark:border-gray-600 group-hover:border-[#644DB3]/50"}`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 bg-[#644DB3] rounded-full" />
                            )}
                          </div>
                          <span
                            className={`text-base font-medium ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-[#898989]"}`}
                          >
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-10 pt-5 pb-10 text-slate-500 dark:text-[#aaa] h-64">
              <Lottie
                animationData={Empty}
                style={{ width: 200, height: 200 }}
              />
              <p className="dark:text-gray-400">No questions found</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#1e1e1e] flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitMutation.isPending || isLoading}
            className="px-8 py-2.5 bg-[#644DB3] hover:bg-[#523d94] text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Submit Exam
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
