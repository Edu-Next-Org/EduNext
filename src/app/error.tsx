"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                    bg-white dark:bg-[#0f0f12] transition-colors duration-300"
    >
      <div
        className="relative flex flex-col items-center gap-6 px-10 py-12 
                      rounded-2xl 
                      bg-white/70 dark:bg-white/5 
                      backdrop-blur-xl 
                      border border-gray-200 dark:border-white/10 
                      shadow-xl"
      >
        <div
          className="absolute -z-10 w-72 h-72 rounded-full 
                        bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500 
                        opacity-20 blur-3xl"
        />

        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
          {error.message}
        </p>

        <Button
          onClick={() => reset()}
          className="mt-4 px-6 py-2 rounded-lg 
                     bg-black text-white 
                     dark:bg-white dark:text-black 
                     transition-all duration-200 
                     hover:scale-105 active:scale-95"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
