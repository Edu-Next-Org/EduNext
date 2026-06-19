import {
  getUserInfo,
  IUser,
  IUserInfo,
} from "@/core/services/api/Get/GetUserInfo";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import React from "react";
import ToggleThem from "../../../../Utils/helper/ToggleThem";
import MobileNavPanel from "./MobileNavPanel";

const HorizontalNav = async () => {
  const user: IUser | null = await getUserInfo();
  return (
    <>
      <div
        className="lg:flex items-center justify-between w-full 
       shadow dark:shadow-lg  lg:px-15 py-5 hidden "
      >
        <ToggleThem />
        <div className="flex items-center gap-4 ">
          <h2 className="text-[21px] font-medium  ">
            {user?.name || "no Name"}
          </h2>
          <Image
            src={user?.profileImage || "/images/NoImage.png"}
            width={45}
            height={45}
            alt={user?.name || ""}
            className="rounded-full object-cover slideUp"
          />
        </div>
      </div>
      <div className="lg:hidden">
        <MobileNavPanel
          name={user?.name || "no Name"}
          image={user?.profileImage || "/images/NoImage.png"}
        />
      </div>
    </>
  );
};

export default HorizontalNav;
