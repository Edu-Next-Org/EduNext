import { toast } from "sonner";

export const logOut = async (
  router: ReturnType<typeof import("next/navigation").useRouter>,
) => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }

    toast.success("Logged out successfully");

    router.replace("/");
    router.refresh();
  } catch {
    toast.error("Failed to log out");
  }
};
