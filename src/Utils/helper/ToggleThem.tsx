"use client";
import { useTheme } from "@/components/useThemes/useThemes";
import { Moon, Sun } from "lucide-react";
import React from "react";

const ToggleThem = () => {
  const { toggleTheme } = useTheme();
  return (
    <div
      onClick={toggleTheme}
      className="rounded-full  cursor-pointer slideUp "
    >
      <Sun
        size={30}
        className="text-orange-400 hidden dark:block transition-colors"
      />
      <Moon
        size={30}
        className="text-slate-700 block dark:hidden transition-colors hover:text-[#644DB3] transition-all duration-100"
      />
    </div>
  );
};

export default ToggleThem;
