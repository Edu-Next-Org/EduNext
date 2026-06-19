"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";

interface TeacherCourseCardProps {
  title: string;
  image: string;
  category: string;
  rate: number;
  price: number;
}

export function TeacherCourseCard({
  title,
  image,
  category,
  rate,
  price,
}: TeacherCourseCardProps) {
  const [imageSrc, setImageSrc] = useState(image || "/images/HTML5Course.png");

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-[#444] dark:bg-[#2a2a2a]">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          onError={() => setImageSrc("/images/HTML5Course.png")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 rounded-lg !border-none !bg-black/60 !text-white !backdrop-blur-md">
          {category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="line-clamp-2 min-h-[3rem] text-base font-semibold text-slate-900 dark:text-white">
          {title}
        </h4>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-[#333]">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm font-medium">{rate.toFixed(1)}</span>
          </div>
          <div className="text-sm font-bold text-violet-600 dark:text-violet-400">
            {price === 0 ? "Free" : `${price} $`}
          </div>
        </div>
      </div>
    </div>
  );
}
