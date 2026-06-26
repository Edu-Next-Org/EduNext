"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import Empty from "@/assets/Lottie/Empty.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/core/services/api/Get/GetAllUser";

type RoleIconMap = Record<string, { icon: LucideIcon; label: string }>;

interface UserManagementMobileCardsProps {
  users: AdminUser[];
  roleIconMap: RoleIconMap;
  onViewProfile: (user: AdminUser) => void;
  onEditRole: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onBlockUser: (user: AdminUser) => void;
}

export function UserManagementMobileCards({
  users,
  roleIconMap,
  onViewProfile,
  onEditRole,
  onEditUser,
  onBlockUser,
}: UserManagementMobileCardsProps) {
  return (
    <div className="space-y-4 xl:hidden py-5">
      {users.length === 0 ? (
        <div className="flex flex-col  !w-[100%] mx-auto items-center justify-center gap-10 pt-10 pb-20 text-slate-500 dark:text-[#aaa]">
          <Lottie style={{ width: 200, height: 200 }} animationData={Empty} />
          <p> No users found for this search</p>
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]"
          >
            <div className="flex items-start justify-between gap-3 ">
              <div className="flex items-center gap-3 ">
                <Image
                  src={user.profileImage ?? "/images/people.png"}
                  alt={user.name}
                  width={42}
                  height={42}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200  dark:bg-[#ccc]"
                />
                <div className="space-y-0.5">
                  <h3 className="font-semibold dark:text-white">{user.name}</h3>
                  <p className="text-[13px] text-slate-500 dark:text-[#ccc] break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl shrink-0 cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem
                    onClick={() => onViewProfile(user)}
                    className="cursor-pointer"
                  >
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEditRole(user)}
                    className="cursor-pointer"
                  >
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEditUser(user)}
                    className="cursor-pointer"
                  >
                    Edit User Info
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onBlockUser(user)}
                    className="text-rose-600 cursor-pointer"
                  >
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {user.roles?.map((role) => {
                  const config = roleIconMap[role];
                  if (!config) return null;

                  const RoleIcon = config.icon;

                  return (
                    <Tooltip key={role}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-[#454545] dark:text-white">
                          <RoleIcon className="h-4 w-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{config.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              <Badge
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  user.gender?.toLowerCase() === "male" &&
                    "!border-violet-600 !bg-violet-50 !text-violet-600  dark:!border-violet-500 dark:!bg-violet-500/10 dark:!text-violet-400",
                  user.gender?.toLowerCase() === "female" &&
                    "!border-pink-600 !bg-pink-50 !text-pink-600  dark:!border-pink-500 dark:!bg-pink-500/10 dark:!text-pink-400",
                  (!user.gender ||
                    !["male", "female"].includes(user.gender.toLowerCase())) &&
                    "!border-indigo-700 !bg-indigo-50 !text-indigo-700  dark:!border-indigo-300 dark:!bg-indigo-500/20 dark:!text-indigo-300",
                )}
              >
                {user.gender?.toLowerCase() === "male"
                  ? "Male"
                  : user.gender?.toLowerCase() === "female"
                    ? "Female"
                    : "Other"}
              </Badge>
            </div>

            <div className="mt-4 text-sm text-slate-500 dark:text-[#ccc]">
              Created At : {user.createdAt}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
