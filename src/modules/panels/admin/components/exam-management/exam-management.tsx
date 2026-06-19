"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  BookOpen,
  Clock,
  Target,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { ExamFormModal } from "./modals/ExamFormModal";
import { QuestionFormModal } from "./modals/QuestionFormModal";
import { DeleteActionModal } from "./modals/DeleteActionModal";

type Exam = {
  _id: string;
  title: string;
  passingScore: number;
  timeLimit: number;
  course: string;
};
type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  score: number;
};

export function ExamManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "exam" | "question";
    id: string;
  } | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);

    setExam({
      _id: "6a1a0dc1e9cc429a640ada04",
      course: "6a1a0db3e9cc429a640ad9f8",
      title: "Final Exam - React Masterclass",
      passingScore: 70,
      timeLimit: 60,
    });

    setQuestions([
      {
        _id: "q1",
        text: "What is React.js?",
        options: ["Framework", "Database", "Library", "Language"],
        correctAnswer: "Library",
        score: 1,
      },
      {
        _id: "q2",
        text: "What is Virtual DOM?",
        options: [
          "A real DOM",
          "A lightweight JavaScript object",
          "A browser feature",
          "A React plugin",
        ],
        correctAnswer: "A lightweight JavaScript object",
        score: 2,
      },
    ]);
  };

  const openDeleteModal = (type: "exam" | "question", id: string) => {
    setDeleteTarget({ type, id });
    setIsDeleteModalOpen(true);
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
            Exam Management
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc]">
            Search for a course to manage its exams, passing scores, and
            questions.
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333] mt-12 mb-6.5">
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl py-6 pl-10 bg-white dark:bg-[#2a2a2a] border-slate-200 dark:border-[#444]"
                placeholder="Enter Course ID or Title to search..."
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-2xl py-6 px-8 bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all"
            >
              Search Course
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-[#3a3a3a]">
                  <BookOpen className="h-12 w-12 text-slate-400 dark:text-[#898989]" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  No course selected
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-[#898989] max-w-sm">
                  Please search for your desired course using the search bar
                  above to view or create exams.
                </p>
              </motion.div>
            ) : !exam ? (
              <motion.div
                key="no-exam"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className=" flex flex-col items-center justify-center py-20.5 mb-7 text-center border-2 border-dashed border-slate-200 dark:border-[#444] rounded-3xl"
              >
                <Target className="h-10 w-10 text-violet-400 mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  No Exam Found
                </h3>
                <p className="text-sm text-slate-500 dark:text-[#898989] mb-4">
                  This course doesnt have an exam yet.
                </p>
                <Button
                  onClick={() => setIsExamModalOpen(true)}
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Exam
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="exam-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="rounded-3xl bg-slate-50 dark:bg-[#3a3a3a] border border-slate-100 dark:border-[#444] p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-[#898989] mt-1">
                        Course ID: {exam.course}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsExamModalOpen(true)}
                        className="rounded-xl border-slate-200 dark:border-[#555] dark:text-white"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Exam
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => openDeleteModal("exam", exam._id)}
                        className="rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 border-none shadow-none"
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
                        <span className="text-sm font-normal text-slate-500">
                          mins
                        </span>
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
                        <span className="text-sm font-normal text-slate-500">
                          pts
                        </span>
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
                      className="rounded-xl bg-violet-600 hover:bg-violet-700 h-9 px-4 text-xs"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Question
                    </Button>
                  </div>

                  <div className="space-y-3 pb-5">
                    {questions.map((q, index) => (
                      <div
                        key={q._id}
                        className="group bg-white dark:bg-[#3a3a3a] border border-slate-200 dark:border-[#444] rounded-2xl p-5 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all"
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm ${
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
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-[#444] dark:hover:text-violet-400"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteModal("question", q._id)}
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-[#444] dark:hover:text-rose-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <ExamFormModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        initialData={exam}
        courseId={exam?.course || "course_id_here"}
      />

      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        initialData={selectedQuestion}
        examId={exam?._id || ""}
      />

      <DeleteActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        type={deleteTarget?.type || "exam"}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
        }}
      />
    </motion.div>
  );
}
