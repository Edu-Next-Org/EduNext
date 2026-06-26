"use client";

import {
  Clock,
  Target,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";

type Exam = {
  _id: string;
  title: string;
  passingScore: number;
  timeLimit: number;
  course: string;
  createdAt: string;
};

type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  score: number;
};

interface ExamManagementMobileProps {
  exam: Exam;
  questions: Question[];
  setIsExamModalOpen: (open: boolean) => void;
  openDeleteModal: (type: "exam" | "question", id: string) => void;
  setSelectedQuestion: (q: Question | null) => void;
  setIsQuestionModalOpen: (open: boolean) => void;
}

export function ExamManagementMobile({
  exam,
  questions,
  setIsExamModalOpen,
  openDeleteModal,
  setSelectedQuestion,
  setIsQuestionModalOpen,
}: ExamManagementMobileProps) {
  return (
    <div className="block md:hidden space-y-8">
      <div className="rounded-3xl bg-slate-50 dark:bg-[#3a3a3a] border border-slate-100 dark:border-[#444] p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {exam.title}
            </h3>
            <span className="text-sm text-slate-500 dark:text-[#898989] mt-1">
              Created At :{" "}
              {new Date(exam.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsExamModalOpen(true)}
              className="cursor-pointer rounded-xl border-slate-200 dark:border-[#555] dark:text-white"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Exam
            </Button>
            <Button
              variant="destructive"
              onClick={() => openDeleteModal("exam", exam._id)}
              className="cursor-pointer rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 border-none shadow-none"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#444] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-[#555]">
            <div className="flex items-center gap-2 text-slate-500 dark:text-[#ccc] mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Time Limit
              </span>
            </div>
            <p className="text-2xl font-semibold dark:text-white">
              {exam.timeLimit}{" "}
              <span className="text-sm font-normal text-slate-500">mins</span>
            </p>
          </div>
          <div className="bg-white dark:bg-[#444] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-[#555]">
            <div className="flex items-center gap-2 text-slate-500 dark:text-[#ccc] mb-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Passing Score
              </span>
            </div>
            <p className="text-2xl font-semibold dark:text-white">
              {exam.passingScore}{" "}
              <span className="text-sm font-normal text-slate-500">pts</span>
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white dark:bg-[#444] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-[#555]">
            <div className="flex items-center gap-2 text-slate-500 dark:text-[#ccc] mb-2">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Questions
              </span>
            </div>
            <p className="text-2xl font-semibold dark:text-white">
              {questions.length}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold dark:text-white">
            Questions List
          </h4>
          <Button
            onClick={() => {
              setSelectedQuestion(null);
              setIsQuestionModalOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-violet-600 hover:bg-violet-700 h-9 px-4 text-xs"
          >
            <Plus className="mr-1 h-3 w-3" /> Add Question
          </Button>
        </div>

        <div className="space-y-3 pb-5">
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
              <Lottie
                style={{ width: 200, height: 200 }}
                animationData={Empty}
              />
              <p> There are no questions</p>
            </div>
          ) : (
            questions.map((q, index) => (
              <div
                key={q._id}
                className=" group bg-white dark:bg-[#3a3a3a] border border-slate-200 dark:border-[#444] rounded-2xl p-5 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-slate-100 text-slate-600 dark:bg-[#444] dark:text-[#ccc] hover:bg-slate-200 border-none font-medium">
                        Q {index + 1}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-violet-600 border-violet-200 dark:text-violet-400 dark:border-violet-500/30 font-medium"
                      >
                        Score: {q.score}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-slate-900 dark:text-white text-base mb-4 leading-relaxed">
                      {q.text}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm w-full ${
                            opt === q.correctAnswer
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 font-medium"
                              : "bg-slate-50 border-slate-100 text-slate-600 dark:bg-[#333] dark:border-[#444] dark:text-[#ccc]"
                          }`}
                        >
                          {opt === q.correctAnswer ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-[#555]" />
                          )}
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setIsQuestionModalOpen(true);
                      }}
                      className="cursor-pointer h-8 w-8 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-[#444] dark:hover:text-violet-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal("question", q._id)}
                      className="cursor-pointer h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-[#444] dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
