import React from "react";
import Navbar from "../navbar/navbar";
import Container from "../container/Container";

function Layouts({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default Layouts;
