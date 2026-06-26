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

interface UserManagementDesktopTableProps {
  users: AdminUser[];
  roleIconMap: RoleIconMap;
  onViewProfile: (user: AdminUser) => void;
  onEditRole: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onBlockUser: (user: AdminUser) => void;
}

export function UserManagementDesktopTable({
  users,
  roleIconMap,
  onViewProfile,
  onEditRole,
  onEditUser,
  onBlockUser,
}: UserManagementDesktopTableProps) {
  return (
    <div className="hidden overflow-x-auto xl:block">
      <table className="min-w-full text-left text-sm">
        <thead className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 dark:bg-[#454545]">
          <tr>
            <th className="px-10 py-4 font-medium dark:text-[#ccc]">User</th>
            <th className="px-8 py-4 font-medium dark:text-[#ccc]">Email</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Role</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Gender</th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">
              Created At
            </th>
            <th className="px-4 py-4 font-medium dark:text-[#ccc]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                <div className="flex flex-col  w-full items-center justify-center gap-10 pt-10  text-slate-500 dark:text-[#aaa]">
                  <Lottie
                    style={{ width: 200, height: 200 }}
                    animationData={Empty}
                  />
                  <p>No users found for this search</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="px-4 py-4">
                  <div className=" rounded-full flex items-center gap-3">
                    <Image
                      src={user.profileImage ?? "/images/people.png"}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-[#555] dark:bg-[#ccc]"
                    />
                    <span className="font-medium dark:text-[white]">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-[#ccc]">
                  {user.email}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
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
                </td>

                <td className="px-4 py-4">
                  <Badge
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      user.gender?.toLowerCase() === "male" &&
                        "!border-violet-600 !bg-violet-50 !text-violet-600  dark:!border-violet-500 dark:!bg-violet-500/10 dark:!text-violet-400",
                      user.gender?.toLowerCase() === "female" &&
                        "!border-pink-600 !bg-pink-50 !text-pink-600  dark:!border-pink-500 dark:!bg-pink-500/10 dark:!text-pink-400",
                      (!user.gender ||
                        !["male", "female"].includes(
                          user.gender.toLowerCase(),
                        )) &&
                        "!border-indigo-700 !bg-indigo-50 !text-indigo-700  dark:!border-indigo-300 dark:!bg-indigo-500/20 dark:!text-indigo-300",
                    )}
                  >
                    {user.gender?.toLowerCase() === "male"
                      ? "Male"
                      : user.gender?.toLowerCase() === "female"
                        ? "Female"
                        : "Other"}
                  </Badge>
                </td>

                <td className="px-4 py-4 text-slate-600 dark:text-[#ccc]">
                  {user.createdAt}
                </td>

                <td className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl cursor-pointer"
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
