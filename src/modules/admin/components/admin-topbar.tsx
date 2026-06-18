"use client";

import { Bell, Home, Moon, Search, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { adminBadgeMap, adminTitleMap } from "../utils/nav";
import { useTheme } from "@/components/useThemes/useThemes";

import Link from "next/link";
import { MobileSidebar } from "./admin-sidebar";

export function AdminTopbar() {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const title = adminTitleMap[pathname] ?? "Admin Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/55 dark:border-[#333] backdrop-blur-xl dark:bg-[#333]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:pl-8">
        <div>
          <h1 className=" hidden lg:flex mt-2 text-sm font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc] hidden lg:flex">
            Welcome back, Michael! Here’s what is happening today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            onClick={toggleTheme}
            className="rounded-full flex items-center justify-center cursor-pointer "
          >
            <Sun className="text-orange-400 hover:text-orange-500 hidden dark:block transition-colors w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
            <Moon className=" block dark:hidden transition-colors text-violet-500 w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 hover:text-violet-700 transition-all duration-100" />
          </div>
          <Link href="/">
            <Home className="h-7 w-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 dark:text-[#ccc]  text-slate-600 hover:!text-violet-500 transition-all duration-200 cursor-pointer" />
          </Link>
          <Avatar className=" w-11 h-11 sm:h-14 sm:w-14 rounded-full ">
            <AvatarImage
              className="object-cover"
              src="/images/hero.png"
              alt="Profile"
            />
            <AvatarFallback className="text-[12px] sm:text-[12px]">
              MR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
