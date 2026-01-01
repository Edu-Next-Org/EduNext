import React from "react";

function Layouts({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#eeee] ">{children}</div>;
}

export default Layouts;
