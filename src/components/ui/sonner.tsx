"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      richColors={false}
      closeButton={false}
      expand
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 shrink-0 text-emerald-500" />
        ),
        info: <InfoIcon className="size-5 shrink-0 text-sky-500" />,
        warning: (
          <TriangleAlertIcon className="size-5 shrink-0 text-amber-500" />
        ),
        error: <OctagonXIcon className="size-5 shrink-0 text-rose-500" />,
        loading: (
          <Loader2Icon className="size-5 shrink-0 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group toast flex items-start rounded-2xl !bg-[white] !text-[black] dark:!text-[white] dark:!bg-[#1e1e1e]  px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-md",
            "transition-all duration-200",
          ].join(" "),
          icon: "w-6 shrink-0 pt-0.5",
          content: "min-w-0 flex-1 pl-2",
          title:
            "text-[15px] font-semibold leading-5 tracking-tight [font-family:var(--font-inter),sans-serif]",
          description:
            "text-sm leading-5 text-inherit/80 [font-family:var(--font-inter),sans-serif]",
          actionButton:
            "rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted",
        },
      }}
      style={
        {
          fontFamily: "var(--font-inter), sans-serif",
          "--normal-border": "transparent",
          "--normal-border-hover": "transparent",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
