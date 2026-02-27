"use client";

import { useEffect, useState } from "react";
import api from "@/core/services/api";
import { setAccessToken } from "@/core/services/token.service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.post("/auth/refresh-token");
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
        }
      } catch (error) {
        console.log("No active session found.");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // if (isInitializing) {
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center">
  //       Loading...
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
