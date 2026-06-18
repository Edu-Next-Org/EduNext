import React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className = "",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={`
        shrink-0 bg-border
        ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"}
        ${className}
      `}
      {...props}
    />
  );
}
