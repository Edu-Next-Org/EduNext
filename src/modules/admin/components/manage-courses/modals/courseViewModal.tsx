"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Star,
  User,
  Layers,
  Gauge,
  DollarSign,
  BookOpen,
  FileText,
} from "lucide-react";

export interface ViewCourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  teacher: string;
  rate: number;
  price: string;
  image: string;
}

interface CourseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData: ViewCourseData | null;
}

export function CourseViewModal({
  isOpen,
  onClose,
  courseData,
}: CourseViewModalProps) {
  if (!courseData) return null;

  const data = courseData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:border-[#444] dark:bg-[#333]/95 mobile:max-w-sm sm:max-w-md md:max-w-lg">
        <DialogHeader className="space-y-3 text-left">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 dark:bg-violet-500/20 dark:text-violet-400">
              <Layers className="mr-1 h-3 w-3" />
              {data.category}
            </Badge>
            <Badge className="rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-400/20 dark:text-amber-400">
              <Gauge className="mr-1 h-3 w-3" />
              {data.level}
            </Badge>
          </div>

          <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            <BookOpen className="h-6 w-6 shrink-0 text-violet-600" />
            {data.title}
          </DialogTitle>
        </DialogHeader>

        <hr className="border-slate-200/60 dark:border-[#444]" />

        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-inner dark:border-[#444] dark:bg-[#252525]">
            <Image
              src={data.image || "/images/ImageUn.png"}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-[#ccc]">
              <FileText className="h-4 w-4" />
              Course Description
            </h4>
            <p className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-600 dark:border-[#444]/30 dark:bg-[#454545]/40 dark:text-[#b1b1b1]">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/30 p-3 dark:border-[#444]/50 dark:bg-[#3a3a3a]/50">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Teacher
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {data.teacher}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/30 p-3 dark:border-[#444]/50 dark:bg-[#3a3a3a]/50">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500 dark:text-amber-400">
                <Star className="h-5 w-5 fill-amber-500/20" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Rating
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {Number(data.rate.toFixed(1))}
                  <span className="text-xs font-normal text-slate-400">
                    (Out of 5)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/30 p-3 sm:col-span-2 dark:border-[#444]/50 dark:bg-[#3a3a3a]/50">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Course Price
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {data.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <Button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#454545] dark:text-white dark:hover:bg-[#555] sm:w-auto"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
