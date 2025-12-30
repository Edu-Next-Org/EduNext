"use client";

import { Button } from "@/components/ui/button";

function AuthNav() {
  return (
    <div className=" flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-1 lg:mt-0 lg:gap-0  ">
      <Button
        variant="outline"
        className="shadow-md  py-1 px-3 lg:px-5 rounded-md "
      >
        login
      </Button>
      <Button className="bg-[#3d1dbf] shadow-md text-white py-1 px-3 lg:px-5 rounded-md ">
        Register
      </Button>
    </div>
  );
}

export default AuthNav;
