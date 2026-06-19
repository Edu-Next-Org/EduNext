import { Lock } from "lucide-react";
import NewPasswordForm from "./NewPasswordForm";

export default function NewPasswordCard({ token }: { token: string }) {
  return (
    <div
      className="w-full max-w-md 
      backdrop-blur-xl bg-white/70 dark:bg-white/10
      border border-white/20
      shadow-2xl rounded-3xl 
      px-8 py-10 
      animate-fadeIn"
    >
      <div className="flex justify-center mb-4">
        <div
          className="w-14 h-14 flex items-center justify-center 
          rounded-full bg-[#644DB3]/10"
        >
          <Lock className="text-[#644DB3]" size={28} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">
        Create New Password
      </h2>

      <p className="text-sm text-muted-foreground text-center mb-6">
        Your new password must be different from previous ones.
      </p>

      <NewPasswordForm token={token} />
    </div>
  );
}
