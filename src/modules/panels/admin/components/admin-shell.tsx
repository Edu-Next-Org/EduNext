"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import type { UserProfile } from "@/core/services/api/Get/GetUserInfoAdmin";

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user: UserProfile | null;
}) {
  return (
    <div className="min-h-screen dark:bg-none dark:!bg-[#1e1e1e] bg-gradient-to-br from-[#fbf8ff] via-[#f8f4ff] to-[#f4efff] text-slate-900 overflow-x-hidden ">
      <AdminSidebar user={user} />
      <div className="lg:pl-72">
        <AdminTopbar user={user} />
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="px-4 py-6 sm:px-6 lg:px-8 dark:bg-[#1e1e1e]"
        >
          <div className="mx-auto max-w-[1600px]  ">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
