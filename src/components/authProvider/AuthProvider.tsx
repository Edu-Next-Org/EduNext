"use client";

import { useEffect } from "react";
import api from "@/core/services/api";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    api.defaults.withCredentials = true;
  }, []);

  return <>{children}</>;
}
