"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PostNewPass } from "@/core/services/api/post/NewPass";
import { toast } from "sonner";

export interface INewPass {
  password: string | null;
  confirmPassword?: string;
  token: string;
}
export default function NewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [submited, setSubmited] = useState<boolean>(false);

  const [state, action, isPending] = useActionState<
    {
      data: INewPass;
      error: Record<string, string> | null;
    },
    FormData
  >(PostNewPass, {
    data: {
      token: token,
      password: "",
      confirmPassword: "",
    },
    error: null,
  });
  const handleSubmit = (formData: FormData) => {
    setSubmited(true);
    action(formData);
  };
  const { data, error } = state;
  useEffect(() => {
    if (!submited) return;
    if (isPending) return;
    if (error) {
      toast.error("Something went wrong ");
    } else if (data) {
      toast.success("password changed successfully ");
      router.push(`/login`);
    }
  }, [state]);
  return (
    <form action={handleSubmit} className="space-y-5">
      <Input type="hidden" name="token" defaultValue={token} />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          name="password"
          defaultValue={data?.password || ""}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-muted-foreground"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error?.password && (
        <p className="text-red-500 text-sm mt-1">{error.password}</p>
      )}

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="confirm Password"
          name="confirmPassword"
          defaultValue={data?.confirmPassword || ""}
        />

        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-2.5 text-muted-foreground"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error?.confirmPassword && (
        <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-b from-[#644DB3] to-[#5B48AC] text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
