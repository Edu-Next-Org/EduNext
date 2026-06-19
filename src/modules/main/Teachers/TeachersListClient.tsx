"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TeacherCard } from "./TeacherCard";
import { PaginationComp } from "@/components/PaginationComp";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";

type Teacher = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  gender: "Male" | "Female" | "Other";
};

interface TeachersListClientProps {
  initialTeachers: Teacher[];
  totalPages: number;
  currentPage: number;
}

export function TeachersListClient({
  initialTeachers,
  totalPages,
  currentPage,
}: TeachersListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const currentSearchInUrl = searchParams.get("search") || "";

    if (searchQuery === currentSearchInUrl) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/50 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between dark:border-[#444] dark:bg-[#333]/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Our Teachers
          </h1>
          <p className="text-sm text-slate-500 dark:text-[#aaa]">
            Manage and view all registered instructors.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-2xl border-slate-200 bg-white py-5 pl-10 dark:border-[#555] dark:bg-[#2a2a2a]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {initialTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} {...teacher} />
        ))}
      </div>

      {initialTeachers.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
          <Lottie style={{ width: 200, height: 200 }} animationData={Empty} />
          <p>No teachers found matching your search.</p>
        </div>
      )}

      {initialTeachers.length > 0 && totalPages > 1 && (
        <PaginationComp currentPage={currentPage} totalPages={totalPages} />
      )}
    </motion.div>
  );
}
