"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  BookOpen,
  Target,
  Calendar,
  Layers,
  Image as ImageIcon,
  SearchX,
  CornerDownLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminCourse } from "@/core/services/api/Get/GetAllCoursesAdmin";
import { ApiExam } from "@/core/services/api/Get/GetExamAdmin";
import { ApiQuestion } from "@/core/services/api/Get/GetQuestionAdmin";
import { ExamFormModal } from "./modals/ExamFormModal";
import { QuestionFormModal } from "./modals/QuestionFormModal";
import { DeleteActionModal } from "./modals/DeleteActionModal";
import Lottie from "lottie-react";
import loading from "@/assets/Lottie/Loader.json";
import Image from "next/image";

import { ExamManagementDesktop } from "./exam-management-desktop";
import { ExamManagementMobile } from "./exam-management-mobile";

interface ExamManagementProps {
  initialCourses: AdminCourse[];
  serverExam: ApiExam | null;
  serverQuestions: ApiQuestion[];
}

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

export function ExamManagement({
  initialCourses,
  serverExam,
  serverQuestions,
}: ExamManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCourseId = searchParams.get("courseId");
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!currentCourseId);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() !== "" || !currentCourseId) return;

    const timer = setTimeout(() => {
      setHasSearched(false);

      startTransition(() => {
        router.replace("/panels/admin/exam-management", { scroll: false });
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, currentCourseId, router, startTransition]);

  const filteredCourses = initialCourses.filter((course) =>
    course.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

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

  const openDeleteModal = (type: "exam" | "question", id: string) => {
    setDeleteTarget({ type, id });
    setIsDeleteModalOpen(true);
  };

  const exam: Exam | null = useMemo(() => {
    if (!serverExam) return null;
    return {
      _id: serverExam._id,
      title: serverExam.title,
      passingScore: serverExam.passingScore,
      timeLimit: serverExam.timeLimit,
      createdAt: serverExam.createdAt,
      course:
        typeof serverExam.course === "object"
          ? serverExam.course._id
          : serverExam.course,
    };
  }, [serverExam]);

  const questions: Question[] = useMemo(() => {
    if (!serverQuestions) return [];
    return serverQuestions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      score: q.score,
    }));
  }, [serverQuestions]);

  const handleSelectCourse = (course: AdminCourse) => {
    setSearchQuery(course.title);
    setIsSearchFocused(false);
    setHasSearched(true);

    startTransition(() => {
      router.push(`?courseId=${course.id}`, { scroll: false });
    });
  };

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
            <div className="relative flex-1 w-full">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="w-full rounded-2xl py-6 pl-12 bg-slate-50 dark:bg-[#2a2a2a]/50 border-slate-200 dark:border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-violet-500/50"
                  placeholder="Type course title to search..."
                />

                {searchQuery !== debouncedSearch && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isSearchFocused && debouncedSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 right-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#1c1c1f]/90 shadow-[0_20px_50px_-12px_rgba(124,58,237,0.18)] dark:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)] backdrop-blur-2xl"
                  >
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 dark:via-violet-400/40 to-transparent" />

                    {filteredCourses.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#777]">
                            {filteredCourses.length} result
                            {filteredCourses.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <motion.div
                          key={debouncedSearch}
                          variants={{
                            hidden: {},
                            show: {
                              transition: {
                                staggerChildren: 0.035,
                                delayChildren: 0.02,
                              },
                            },
                          }}
                          initial="hidden"
                          animate="show"
                          className="flex max-h-[300px] flex-col gap-0.5 overflow-y-auto px-2 pb-2"
                        >
                          {filteredCourses.map((course) => (
                            <motion.div
                              key={course.id}
                              variants={{
                                hidden: { opacity: 0, y: -6 },
                                show: { opacity: 1, y: 0 },
                              }}
                              onClick={() => handleSelectCourse(course)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleSelectCourse(course);
                                }
                              }}
                              role="button"
                              tabIndex={0}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.985 }}
                              className="group relative flex cursor-pointer items-center gap-3 rounded-xl p-2.5 outline-none transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/10 focus-visible:bg-violet-50 dark:focus-visible:bg-violet-500/10 focus-visible:ring-2 focus-visible:ring-violet-500/50"
                            >
                              <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 transition-all duration-200 group-hover:h-2/3" />

                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a2a2d] dark:to-[#222225] ring-1 ring-black/5 dark:ring-white/10">
                                {course.image ? (
                                  <Image
                                    fill
                                    unoptimized
                                    sizes="44px"
                                    src={course.image}
                                    alt={course.title}
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-slate-400 dark:text-[#555]" />
                                  </div>
                                )}
                              </div>

                              <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                  {course.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#888]">
                                  <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 font-medium text-violet-700 dark:text-violet-300">
                                    <Layers className="h-3 w-3" />
                                    {course.category}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      course.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              <kbd className="hidden shrink-0 items-center rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-1.5 py-1 text-[10px] font-medium text-slate-400 dark:text-[#777] opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
                                <CornerDownLeft className="h-3 w-3" />
                              </kbd>
                            </motion.div>
                          ))}
                        </motion.div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-500/10">
                          <SearchX className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            No results for{" "}
                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                              &quot;{debouncedSearch}&quot;
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-slate-400 dark:text-[#777]">
                            Try checking your spelling or use a different
                            keyword.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <div className="mb-4 rounded-full bg-violet-400/20 p-6 dark:bg-violet-400/20">
                    <BookOpen className="h-12 w-12 text-violet-500 dark:text-violet-400" />
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
                    className=" cursor-pointer rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className=" h-4 w-4" /> Create Exam
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="exam-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ExamManagementDesktop
                    exam={exam}
                    questions={questions}
                    setIsExamModalOpen={setIsExamModalOpen}
                    openDeleteModal={openDeleteModal}
                    setSelectedQuestion={setSelectedQuestion}
                    setIsQuestionModalOpen={setIsQuestionModalOpen}
                  />

                  <ExamManagementMobile
                    exam={exam}
                    questions={questions}
                    setIsExamModalOpen={setIsExamModalOpen}
                    openDeleteModal={openDeleteModal}
                    setSelectedQuestion={setSelectedQuestion}
                    setIsQuestionModalOpen={setIsQuestionModalOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <ExamFormModal
          key={exam ? exam._id : "create"}
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
          courseId={currentCourseId || ""}
          initialData={exam}
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
          targetId={deleteTarget?.id || ""}
        />
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
