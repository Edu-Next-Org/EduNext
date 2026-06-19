"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  FileText,
  Shield,
  ShoppingBag,
  Activity,
  Users,
  ClipboardPlus,
  Crown,
  GraduationCap,
  UserRound,
} from "lucide-react";
import type { UserByIdApiData } from "@/core/services/api/Get/GetUserById";
import Lottie from "lottie-react";
import Loader from "@/assets/Lottie/Loader.json";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const roleIconMap = {
  user: { icon: UserRound, label: "User" },
  teacher: { icon: GraduationCap, label: "Teacher" },
  admin: { icon: Shield, label: "Admin" },
  superadmin: { icon: Crown, label: "Superadmin" },
} as const;

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function orFallback(value: string | null | undefined, fallback = "—"): string {
  return value?.trim() ? value.trim() : fallback;
}

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserByIdApiData | null;
  isLoading: boolean;
}

export function UserViewModal({
  isOpen,
  onClose,
  userData,
  isLoading,
}: UserViewModalProps) {
  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-h-[90vh] rounded-3xl dark:bg-[#333]">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Loading User Data</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <div className="py-10 text-center text-[#898989] flex flex-col items-center justify-center ">
            <Lottie
              animationData={Loader}
              style={{ width: 200, height: 200 }}
            />
            Loading user data...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] overflow-y-auto max-h-[90vh] border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:bg-[#333]/95 dark:border-[#444] rounded-3xl
                   mobile:max-w-sm sm:max-w-md md:max-w-lg scrollbar-thin"
      >
        <DialogHeader className="space-y-4 text-left">
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {userData?.role?.length ? (
                userData.role.map((role) => {
                  const config = roleIconMap[role as keyof typeof roleIconMap];
                  const RoleIcon = config?.icon ?? Shield;
                  const label = config?.label ?? role;

                  return (
                    <Tooltip key={role}>
                      <TooltipTrigger asChild>
                        <Badge className="rounded-full bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 dark:bg-violet-500/20 dark:text-violet-400 px-3 py-1 cursor-default">
                          <RoleIcon className="mr-1.5 h-3.5 w-3.5" />
                          {label}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  );
                })
              ) : (
                <span className="text-sm text-slate-400 dark:text-[#888]">
                  No roles assigned
                </span>
              )}
            </div>
          </TooltipProvider>

          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <User className="h-6 w-6 text-violet-600 shrink-0" />
            {userData?.name ?? "—"}
          </DialogTitle>
        </DialogHeader>

        <hr className="border-slate-200/60 dark:border-[#444] my-2" />

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white dark:border-[#2a2a2a] shadow-lg bg-slate-100 dark:bg-[#252525]">
              <Image
                src={userData?.profileImage ?? "/images/people.png"}
                alt={userData?.name ?? "user"}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105 dark:bg-[#ccc]"
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-[#ccc] flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              About User
            </h4>

            <p className="text-sm text-slate-600 dark:text-[#b1b1b1] leading-relaxed bg-slate-50/50 dark:bg-[#454545]/40 p-4 rounded-2xl border border-slate-100 dark:border-[#444]/30 max-h-40 overflow-y-auto scrollbar-thin">
              {orFallback(userData?.about, "No information provided.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50 sm:col-span-2 overflow-hidden">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Email Address
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate block w-full">
                  {orFallback(userData?.email)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Phone Number
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {orFallback(userData?.phoneNumber)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Birthday
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(userData?.birthday)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400 dark:text-[#898989]">
                  Gender
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                  {orFallback(userData?.gender)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 dark:text-[#898989]">
                  Purchased Courses
                </span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {userData?.purchasedCourses?.length ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-teal-500/10 text-teal-500 dark:text-teal-400 rounded-xl shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 dark:text-[#898989]">
                  Course Progress
                </span>
                <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                  {userData?.courseProgress?.length ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-[#444]/50 bg-slate-50/30 dark:bg-[#3a3a3a]/50">
              <div className="p-2.5 bg-teal-500/10 text-teal-500 dark:text-teal-400 rounded-xl shrink-0">
                <ClipboardPlus className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 dark:text-[#898989]">
                  Create At
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(userData?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#454545] dark:text-white dark:hover:bg-[#555]"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
