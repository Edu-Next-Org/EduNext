"use client";

import { ToastContainer } from "sonner";
import "sonner/dist/ReactToastify.css";

export default function ToastProvider() {
  return <ToastContainer position="top-center" autoClose={3000} />;
}
