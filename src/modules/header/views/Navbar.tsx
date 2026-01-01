"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import AuthNav from "./AuthNav";
import { Links } from "../mock/Links";

function Navbar() {
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
  const DesktopItemVariants: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };
  return (
    <>
      <motion.div
        variants={DesktopNav}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, ease: "easeOut" }}
        className=" hidden lg:flex items-center lg:justify-between fixed top-0 left-0 w-full
       z-50 gap-5 py-6 px-25 bg-[#eeee] shadow  "
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
                className={` transition-all duration-150 ease-in-out hover:font-bold  hover:text-lg
                 ${
                   pathName == items.link
                     ? "font-bold border-b-2 border-b-blue-400 text-md "
                     : ""
                 }   `}
              >
                {items.title}
              </Link>
            </motion.div>
          ))}
          <motion.div variants={DesktopItemVariants}>
            <AuthNav />
          </motion.div>
        </div>
      </motion.div>
      <div className="w-full lg:hidden fixed z-50 top-0 px-6 py-6 bg-[#eeee] ">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold ">EduNext</h1>
          {Open ? <X onClick={handleOpen} /> : <Menu onClick={handleOpen} />}
        </div>
        <AnimatePresence>
          {Open && (
            <>
              <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-[rgba(1,1,1,0.3)]  "
              ></div>
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`
    fixed top-18 right-0
    w-[43%] shadow rounded
    bg-[#eeee]
    flex flex-col gap-7
    px-6 h-[54%]
    
  `}
              >
                {Links.map((items, index) => (
                  <motion.span variants={itemVariants} key={index}>
                    <Link
                      href={items.link}
                      className={`border-b border-[#ccc] w-full transition-all duration-150 ease-in-out
                         hover:font-bold  hover:text-lg  ${
                           pathName == items.link
                             ? "font-bold border-b-2 border-b-blue-400 text-lg "
                             : ""
                         }   `}
                    >
                      {items.title}
                    </Link>
                  </motion.span>
                ))}
                <motion.div variants={itemVariants}>
                  <AuthNav />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Navbar;