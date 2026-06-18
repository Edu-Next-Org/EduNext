"use client";

import { useActionState, useEffect, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostForgotPass } from "@/core/services/api/post/forgotPass";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export interface IEmail {
  email: string | null;
  token?: string | null;
}
export default function ResetPasswordForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [state, action, isPending] = useActionState<
    {
      data: IEmail | null;
      error: Record<string, string> | null;
    },
    FormData
  >(PostForgotPass, {
    data: {
      email: null,
    },
    error: null,
  });
  const { data, error } = state;
  const handleSubmit = (formData: FormData) => {
    setSubmitted(true);
    action(formData);
  };
  useEffect(() => {
    if (!submitted) return;
    if (isPending) return;
    if (error) {
      toast.error("Something went wrong ");
    } else if (data) {
      toast.success("email sent successfully ");
      if (data.token) {
        router.push(`/forgotPass/${data.token}`);
      }
    }
  }, [state]);
  return (
    <form action={handleSubmit} className="w-full animate-fadeInSlow">
      <div className="relative mb-6">
        <Mail
          size={22}
          className="absolute top-[50%] translate-y-[-50%] left-4 text-gray-400"
        />

        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          defaultValue={data?.email || ""}
          className="border w-full py-2 rounded-md outline-none pl-12 pr-4 
          border-[#ccc] 
          focus:border-[#644DB3] focus:ring-1 focus:ring-[#644DB3]
          dark:bg-transparent dark:text-white
          transition-all duration-300"
        />
        {error?.email && (
          <h2 className="absolute top-4 text-red-500 font-semibold">
            {error?.email}
          </h2>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mb-4 bg-gradient-to-b 
        from-[#644DB3] to-[#5B48AC] 
        text-white py-2 rounded-md 
        flex items-center justify-center gap-2
        hover:opacity-90 active:scale-95
        transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
}
