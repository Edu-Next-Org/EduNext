"use client";
import ToggleThem from "@/Utils/helper/ToggleThem";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { VerticalLinks, VerticalNavLinkType } from "../mock/Links";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { LogoutDialog } from "@/components/LogOutDialog";
import { logOut } from "@/modules/layout/header/services";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export interface IMobileNavProp {
  name: string;
  image: string;
}
const MobileNavPanel = ({ name, image }: IMobileNavProp) => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  const [openLogOutModal, setOpenLogOutModal] = useState<boolean>(false);
  const onChangeOpen = (isOpen: boolean) => {
    setOpenLogOutModal(isOpen);
  };
  const menuVariants: Variants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
  const router = useRouter();
  return (
    <div className=" lg:hidden">
      <div className="flex items-center justify-between px-5 py-4 shadow-md ">
        <ToggleThem />
        {openMenu ? <X onClick={toggleMenu} /> : <Menu onClick={toggleMenu} />}
      </div>
      <AnimatePresence>
        {openMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed
top-0
right-0
h-screen
w-[82%]
max-w-[360px]
bg-background
border-l
shadow-2xl
flex
flex-col
z-50"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 py-4 pl-4"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={image || undefined} alt={name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {name.charAt(0).toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-[18px] font-medium ">
                  {name || "no Name"}
                </h2>
              </motion.div>
              {VerticalLinks.map((item: VerticalNavLinkType, i) => (
                <Link
                  key={i}
                  href={item.link}
                  onClick={() => setOpenMenu(false)}
                  className={`pl-5  py-4 transition-all
duration-200 ease-in-out hover:bg-[rgba(61,29,191,0.1)] hover:translate-x-2 hover:font-bold rounded-r-md  ${
                    item.link === pathName
                      ? "bg-violet-600 text-white"
                      : "hover:bg-violet-100 dark:hover:bg-zinc-800"
                  } `}
                >
                  <motion.span variants={itemVariants}>
                    {item.title}
                  </motion.span>
                </Link>
              ))}
              <button
                onClick={() => onChangeOpen(true)}
                className="

flex
items-center
gap-3
rounded-xl
bg-red-500/10
text-red-500
px-4
py-3
hover:bg-red-500/20
"
              >
                <LogOut size={18} />
                Logout
              </button>
              <LogoutDialog
                open={openLogOutModal}
                onOpenChange={onChangeOpen}
                onConfirm={() => {
                  logOut(router);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavPanel;
