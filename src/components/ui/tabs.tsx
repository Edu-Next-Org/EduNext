// "use client";

// import React, { createContext, useContext, useState } from "react";

// interface TabsContextType {
//   value: string;
//   setValue: (value: string) => void;
// }

// const TabsContext = createContext<TabsContextType | null>(null);

// function useTabs() {
//   const context = useContext(TabsContext);

//   if (!context) {
//     throw new Error("Tabs components must be inside Tabs");
//   }

//   return context;
// }

// export function Tabs({
//   defaultValue,
//   children,
// }: {
//   defaultValue: string;
//   children: React.ReactNode;
// }) {
//   const [value, setValue] = useState(defaultValue);

//   return (
//     <TabsContext.Provider value={{ value, setValue }}>
//       {children}
//     </TabsContext.Provider>
//   );
// }

// export function TabsList({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={`
//         inline-flex h-10 items-center justify-center
//         rounded-md bg-muted p-1 text-muted-foreground
//         ${className}
//       `}
//     >
//       {children}
//     </div>
//   );
// }

// export function TabsTrigger({
//   value,
//   children,
//   className = "",
// }: {
//   value: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   const context = useTabs();

//   const active = context.value === value;

//   return (
//     <button
//       onClick={() => context.setValue(value)}
//       className={`
//         inline-flex items-center justify-center
//         whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5
//         text-sm font-medium transition-all
//         ${className}
//         ${active ? "bg-background text-foreground shadow-sm" : ""}
//       `}
//     >
//       {children}
//     </button>
//   );
// }

// export function TabsContent({
//   value,
//   children,
// }: {
//   value: string;
//   children: React.ReactNode;
// }) {
//   const context = useTabs();

//   if (context.value !== value) return null;

//   return <div className="mt-2">{children}</div>;
// }
"use client";

import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be inside Tabs");
  }

  return context;
}

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

export function Tabs({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setValue = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        inline-flex h-10 items-center justify-center
        rounded-md bg-muted p-1 text-muted-foreground
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useTabs();

  const active = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={`
        inline-flex items-center justify-center
        whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5
        text-sm font-medium transition-all
        ${className}
        ${active ? "bg-background text-foreground shadow-sm" : ""}
      `}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const context = useTabs();

  if (context.value !== value) return null;

  return <div className="mt-2">{children}</div>;
}
