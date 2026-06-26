"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminNavItems, logoutNavItem } from "../utils/nav";
import AdminProfileModal from "./AdminProfileModal";
import type { UserProfile } from "@/core/services/api/Get/GetUserInfoAdmin";
import { useState } from "react";

function NavList({
  mobile = false,
  user,
  onNavigate,
}: {
  mobile?: boolean;
  user: UserProfile | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const displayName = user?.name || "Admin User";
  const displayRole = user?.role?.join(" , ") || "Admin";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col ">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm">
          E
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight dark:text-[white]">
            EduNext
          </div>
          <div className="text-xs text-slate-500 dark:text-[#898989]">
            Admin Panel
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const active =
            item.href === "/panels/admin"
              ? pathname === "/panels/admin"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-violet-100 text-violet-700 shadow-sm ring-1 ring-violet-200"
                  : "text-slate-600 hover:bg-violet-200 dark:hover:bg-white hover:text-slate-900 dark:text-[#ccc] hover:dark:text-[black]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {!mobile && active ? (
                <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto ">
        <div className="mb-4 rounded-3xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur dark:bg-[#454545]">
          <div className="flex items-center gap-3">
            <AdminProfileModal
              name={displayName}
              role={displayRole}
              initials={initials}
              imageSrc={user?.profileImage || null}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold dark:text-[white]">
                {displayName}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#ccc]">
                {displayRole}
              </div>
            </div>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 w-full justify-start rounded-2xl  bg-white/80 dark:bg-[#454545]"
        >
          <Link className="dark:text-[#ccc] " href={logoutNavItem.href}>
            <logoutNavItem.icon className="mr-2 h-4 w-4 dark:text-[#ccc]" />
            {logoutNavItem.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function DesktopSidebar({ user }: { user: UserProfile | null }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/70 bg-white/55 dark:border-[#333] px-4 py-5 shadow-[0_10px_40px_rgba(124,58,237,0.08)] backdrop-blur-xl lg:block dark:bg-[#333]">
      <NavList user={user} />
    </aside>
  );
}

export function MobileSidebar({ user }: { user: UserProfile | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden ">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  rounded-2xl border border-white/60 bg-white/100 shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[88vw] max-w-[280px] sm:max-w-[320px] bg-white/100 p-4 z-[100] dark:bg-[#333]"
        >
          <NavList mobile user={user} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function AdminSidebar({ user }: { user: UserProfile | null }) {
  return (
    <>
      <DesktopSidebar user={user} />
    </>
  );
}
