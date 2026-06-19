import Link from "next/link";
import { House } from "lucide-react";

export default function ResetPasswordHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-[22px] md:text-[25px] font-bold text-black dark:text-white">
        Reset Your Password
      </h2>

      <Link href="/">
        <House
          size={28}
          className="text-[#644DB3] cursor-pointer hover:scale-110 transition-transform"
        />
      </Link>
    </div>
  );
}
