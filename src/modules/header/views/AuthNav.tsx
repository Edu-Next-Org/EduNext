"use client";

import Link from "next/link";



function AuthNav() {
  return (
    <div className=" flex items-center  ">
      <Link href="/login">
      <button className="shadow-md cursor-pointer py-1 px-5 rounded-md ">Login</button>
      </Link>
       <Link href="/register">
         <button className="bg-[#3d1dbf] cursor-pointer shadow-md text-white py-1 px-5 rounded-md ">
        Register
      </button>
       </Link>
    
    </div>
  );
}

export default AuthNav;
