"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Links } from "../mock/Links";
import { useTheme } from "@/components/useThemes/useThemes";
import AuthNav from "../views/AuthNav";
import { IUser } from "../views/Navbar";
import { UserMenu } from "../views/User";
import { deleteCookie } from "cookies-next";

function Navbar({ user }: { user?: IUser }) {
  const { toggleTheme } = useTheme();
  const pathName = usePathname();
  const [Open, setOpen] = useState<boolean>(false);
  const handleOpen: () => void = () => {
    setOpen((prev) => !prev);
  };
  const DesktopNav: Variants = {
    hidden: {
      y: "-50%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };
  const menuVariants: Variants = {
    hidden: {
      x: 400,
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 22,
      },
    },
    exit: {
      x: 400,
      transition: {
        duration: 0.25,
      },
    },
  };
  const DesktopItemVariants: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };
  const router = useRouter();
  return (
    <>
      <motion.div
        variants={DesktopNav}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: "easeOut" }}
        className=" hidden lg:flex items-center lg:justify-between fixed top-0 left-0 w-full
       z-50 gap-5 py-6 lg:px-20 bg-[#eeee] shadow dark:bg-[#1e1e1e]  "
      >
        <motion.div
          variants={DesktopItemVariants}
          className="flex items-center  "
        >
          <h1 className="text-2xl font-bold ">EduNext</h1>
        </motion.div>

        <div className="flex items-center justify-start gap-7 ">
          {Links.map((items, index) => (
            <motion.div variants={DesktopItemVariants} key={index}>
              <Link
                href={items.link}
                className={`inline-flex transition-all duration-150 font-smibold ease-in-out hover:text-violet-600 hover:scale-110
                 ${
                   pathName == items.link
                     ? "font-bold border-b-2 border-b-violet-600 text-md py-2 "
                     : ""
                 }   `}
              >
                {items.title}
              </Link>
            </motion.div>
          ))}
          <motion.div variants={DesktopItemVariants}>
            <AuthNav user={user} />
          </motion.div>
        </div>
      </motion.div>
      <div
        className="w-full lg:hidden fixed z-50 top-0 px-6 py-6 bg-[#eeee]
       dark:bg-[#1e1e1e]"
      >
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold ">EduNext</h1>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-4">
              {user && <UserMenu user={user} />}
              <div
                onClick={toggleTheme}
                className="rounded-full  items-center justify-center
                 cursor-pointer  flex lg:hidden"
              >
                <Sun
                  size={35}
                  className="text-orange-400 hidden dark:block transition-colors"
                />
                <Moon
                  size={35}
                  className="text-slate-700 block dark:hidden transition-colors hover:text-[#644DB3] transition-all duration-100"
                />
              </div>
            </div>
            {!Open && (
              <button
                onClick={handleOpen}
                className="
  h-11
  w-11
  rounded-full
  border
  bg-background
  shadow-md
  flex
  items-center
  justify-center
  active:scale-95
  transition
  "
              >
                <Menu />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {Open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="
  fixed
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
  px-6
  py-6
  z-50
"
              >
                <div className="flex items-center justify-between border-b pb-5">
                  <div>
                    <h2 className="text-2xl font-bold">EduNext</h2>

                    <p className="text-sm text-muted-foreground">
                      Online Learning
                    </p>
                  </div>

                  <button
                    onClick={handleOpen}
                    className="
    w-10
    h-10
    rounded-full
    hover:bg-accent
    flex
    items-center
    justify-center
    "
                  >
                    <X />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {Links.map((item, index) => (
                    <motion.div variants={itemVariants} key={index}>
                      <Link
                        onClick={() => setOpen(false)}
                        href={item.link}
                        className={`
          flex
          items-center
          rounded-xl
          px-4
          py-3
          transition-all
          duration-200

          ${
            pathName === item.link
              ? "bg-violet-600 text-white shadow-lg"
              : "hover:bg-violet-100 dark:hover:bg-zinc-800"
          }
        `}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-auto border-t pt-6 space-y-4">
                  {!user && <AuthNav />}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Navbar;
