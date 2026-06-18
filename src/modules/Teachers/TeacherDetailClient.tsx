"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Info, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeacherCourseCard } from "./TeacherCourseCard";
import Image from "next/image";
import { useState } from "react";

type Course = {
  id: string;
  title: string;
  image: string;
  category: string;
  rate: number;
  price: number;
};

type TeacherDetail = {
  id: string;
  name: string;
  email: string;
  gender: string;
  image: string;
  about: string;
  courses: Course[];
};

interface TeacherDetailClientProps {
  teacher: TeacherDetail;
}

export function TeacherDetailClient({ teacher }: TeacherDetailClientProps) {
  const [imageSrc, setImageSrc] = useState(
    teacher.image || "/images/courseteacher.png",
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Link href="/teachers">
        <Button
          variant="ghost"
          className=" cursor-pointer rounded-xl pl-2 mb-5 text-slate-500 hover:text-violet-600 dark:text-[#aaa] dark:hover:bg-[#333] dark:hover:text-violet-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teachers
        </Button>
      </Link>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-violet-50/50 to-white/80 p-8 shadow-sm backdrop-blur-xl md:p-10 dark:border-[#444] dark:from-[#2a2a2a] dark:to-[#333]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/5 blur-3xl dark:bg-violet-500/10" />

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-40 md:w-40 dark:border-[#444]">
            <Image
              src={teacher.image}
              alt={teacher.name}
              width={200}
              height={200}
              onError={() => setImageSrc("/images/courseteacher.png")}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {teacher.name}
              </h1>
              <Badge
                variant="outline"
                className="rounded-xl border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
              >
                <UserCheck className="mr-1 h-3 w-3 inline" />
                Instructor
              </Badge>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 md:justify-start dark:text-[#aaa]">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-violet-500" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Info className="h-4 w-4 text-violet-500" />
                <span>Gender: {teacher.gender}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/60 p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:bg-[#222]/50 dark:text-[#ccc]">
              <p>{teacher.about}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Courses by {teacher.name.split(" ")[0]}
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teacher.courses.map((course) => (
            <TeacherCourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
