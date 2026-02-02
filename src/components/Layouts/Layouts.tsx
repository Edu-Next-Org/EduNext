import React from "react";

function Layouts({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#eeee] dark:bg-[#1e1e1e] ">{children}</div>;
}

export default Layouts;
