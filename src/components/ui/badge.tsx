import React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground border-transparent",

  secondary: "bg-secondary text-secondary-foreground border-transparent",

  destructive: "bg-destructive text-destructive-foreground border-transparent",

  outline: "text-foreground",
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center rounded-md border
        px-2.5 py-0.5 text-xs font-semibold
        transition-colors
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    />
  );
}
