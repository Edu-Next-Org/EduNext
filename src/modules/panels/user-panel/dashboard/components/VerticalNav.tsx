"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { VerticalLinks, VerticalNavLinkType } from "../mock/Links";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { logOut } from "@/modules/layout/header/services";
import { LogoutDialog } from "@/components/LogOutDialog";
import { toast } from "sonner";
function VerticalNav() {
  const [logOutModal, setLogOutModal] = useState<boolean>(false);
  const onChangeModal = (open: boolean) => {
    setLogOutModal(open);
  };

  const router = useRouter();
  const sideBarVariants: Variants = {
    hidden: {
      x: -100,
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: {
      x: -50,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 250,
      },
    },
  };
  const pathName = usePathname();
  return (
    <motion.div
      variants={sideBarVariants}
      initial="hidden"
      animate="visible"
      className="w-full shadow dark:bg-[#1e1e1e] dark:shadow-[0_0_15px_rgba(100,77,179,0.25)] bg-[#ffff] h-full flex flex-col pr-4 rounded-md "
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold py-5 pl-5 animate-slideUp  "
      >
        EduNext
      </motion.h1>
      {VerticalLinks.map((item: VerticalNavLinkType, i) => (
        <Link
          key={i}
          href={item.link}
          className={`pl-5  py-4 transition-all duration-150 ease-in-out hover:bg-[rgba(61,29,191,0.1)] hover:font-bold rounded-r-md  hover:text-lg ${
            item.link == pathName
              ? "bg-[rgba(61,29,191,0.2)] hover:bg-[rgba(61,29,191,0.2)] text-[#3d1dbf] border-l-2  border-[#3d1dbf] "
              : ""
          } `}
        >
          <motion.span variants={itemVariants}>{item.title}</motion.span>
        </Link>
      ))}
      <motion.p
        variants={itemVariants}
        onClick={() => {
          onChangeModal(true);
        }}
        className="pl-5 slideUpX py-4 transition-all duration-150 ease-in-out hover:bg-red-600/20
       hover:font-bold  hover:text-lg rounded-r-md"
      >
        Log out
      </motion.p>
      <LogoutDialog
        open={logOutModal}
        onOpenChange={onChangeModal}
        onConfirm={() => {
          logOut(router);
          router.push("/");
          router.refresh();
          toast.success("Log out successfully");
        }}
      />
    </motion.div>
  );
}

export default VerticalNav;
