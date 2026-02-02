"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthNav() {
  return (
    <div className=" flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center  ">
      <Link href="/login">
        <Button
          variant="secondary"
          className="shadow-md cursor-pointer py-1 px-5 rounded-md "
        >
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button className="bg-[#3d1dbf] cursor-pointer shadow-md text-white py-1 px-5 rounded-md ">
          Register
        </Button>
      </Link>
    </div>
  );
}

export default AuthNav;
