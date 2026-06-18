"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";

interface TeacherCardProps {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  gender: "Male" | "Female" | "Other";
}

export function TeacherCard({
  id,
  name,
  email,
  profileImage,
  gender,
}: TeacherCardProps) {
  const [imageSrc, setImageSrc] = useState(
    profileImage || "/images/people.png",
  );

  return (
    <Link href={`/teachers/${id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur transition-colors hover:border-violet-300 dark:border-[#444] dark:bg-[#2a2a2a]/80 dark:hover:border-violet-500/50"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full  border-white shadow-md dark:border-[#333]">
            <Image
              src={profileImage ?? "/images/people.png"}
              alt={name}
              fill
              onError={() => setImageSrc("/images/people.png")}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 dark:bg-[#ccc]"
            />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            {name}
          </h3>
          <div className="mb-4 flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-[#aaa]">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{email}</span>
          </div>
          <Badge
            variant="secondary"
            className={`rounded-xl px-3 py-1 font-medium ${
              gender === "Female"
                ? "!bg-rose-100 !text-rose-700 dark:!bg-rose-500/20 dark:!text-rose-300"
                : "!bg-indigo-100 !text-indigo-700 dark:!bg-indigo-500/20 dark:!text-indigo-300"
            }`}
          >
            <User className="mr-1.5 h-3 w-3 inline" />
            {gender}
          </Badge>
        </div>
      </motion.div>
    </Link>
  );
}
