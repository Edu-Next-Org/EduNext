"use client";

import React from "react";

type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  className = "",
  checked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  return (
    <label
      className={`
        relative inline-flex h-6 w-11 cursor-pointer items-center
        ${className}
      `}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />

      <div
        className="
          h-6 w-11 rounded-full
          bg-input transition-colors
          peer-checked:bg-primary
        "
      />

      <div
        className="
          absolute left-0.5 top-0.5
          h-5 w-5 rounded-full
          bg-background shadow
          transition-transform
          peer-checked:translate-x-5
        "
      />
    </label>
  );
}
