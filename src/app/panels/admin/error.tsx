"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[79.7vh] flex-col dark:bg-[#333] items-center justify-center gap-4 rounded-3xl bg-white/80 p-10 text-center shadow-sm">
      <h2 className="text-2xl font-semibold dark:text-[white]">
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-slate-500 dark:text-[#ccc]">
        There was an error while loading this admin page.
      </p>
      <Button
        onClick={reset}
        className="rounded-2xl bg-violet-600 hover:bg-violet-700"
      >
        Try again
      </Button>
    </div>
  );
}
