import { getItem } from "@/Utils/helper/storage.services";
import { BaseUrl } from "@/Utils/URL";
import { User2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface IUser {
  name: string;
  image: string | null;
}
function User() {
  //   const res = await fetch(`${BaseUrl}/auth/profile`);
  //   const userData: IUser = await res.json();
  const userData = "";
  return (
    <div className="flex items-center gap-3">
      {userData ? (
        <>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#644DB3]">
            {userData?.image ? (
              <Image
                src={userData.image}
                alt="profile"
                fill
                className="object-cover"
              />
            ) : (
              <User2Icon className="object-cover" />
            )}
          </div>

          <span className="hidden md:block font-medium">{userData.name}</span>
        </>
      ) : (
        <p className="text-red-500">cant find your details</p>
      )}
    </div>
  );
}

export default User;
