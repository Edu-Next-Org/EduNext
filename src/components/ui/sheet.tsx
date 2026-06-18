"use client";

import React, { createContext, useContext, useState } from "react";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | null>(null);

function useSheet() {
  const context = useContext(SheetContext);

  if (!context) {
    throw new Error("Sheet components must be used inside Sheet");
  }

  return context;
}

export function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children }: { children: React.ReactNode }) {
  const { setOpen } = useSheet();

  return <div onClick={() => setOpen(true)}>{children}</div>;
}

export function SheetContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useSheet();

  if (!open) return null;

  return (
    <>
      <div
        className="
          fixed inset-0 z-40 bg-black/50
        "
        onClick={() => setOpen(false)}
      />

      <div
        className={`
          fixed right-0 top-0 z-50
          h-full w-[400px]
          border-l bg-background p-6 shadow-lg
          transition-transform
          ${className}
        `}
      >
        {children}
      </div>
    </>
  );
}

export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex flex-col space-y-2">{children}</div>;
}

export function SheetTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function SheetDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
