"use client";
import ToggleThem from "@/Utils/helper/ToggleThem";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { VerticalLinks, VerticalNavLinkType } from "../mock/Links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, Variants, motion } from "framer-motion";
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
  return (
    <div className=" lg:hidden">
      <div className="flex items-center justify-between px-5 py-4 shadow-md ">
        <ToggleThem />
        {openMenu ? <X onClick={toggleMenu} /> : <Menu onClick={toggleMenu} />}
      </div>
      <AnimatePresence>
        {openMenu && (
          <>
            <div
              onClick={() => setOpenMenu(false)}
              className="fixed inset-0 bg-[rgba(1,1,1,0.3)] z-40 "
            ></div>
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className=" shadow dark:bg-[#1e1e1e] dark:shadow-[0_0_20px_4px_#644DB3] bg-[#ffff]
       flex flex-col pr-4 rounded-md fixed top-18 right-0 z-50
     "
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 py-4 pl-4"
              >
                <Image
                  src={image || "/images/NoImage.png"}
                  width={32}
                  height={32}
                  alt={name || ""}
                  className="rounded-full object-cover border "
                />
                <h2 className="text-[18px] font-medium ">
                  {name || "no Name"}
                </h2>
              </motion.div>
              {VerticalLinks.map((item: VerticalNavLinkType, i) => (
                <Link
                  key={i}
                  href={item.link}
                  onClick={() => setOpenMenu(false)}
                  className={`pl-5  py-4 transition-all duration-150 ease-in-out hover:bg-[rgba(61,29,191,0.1)] hover:font-bold rounded-r-md  hover:text-lg ${
                    item.link == pathName
                      ? "bg-[rgba(61,29,191,0.2)] hover:bg-[rgba(61,29,191,0.2)] text-[#3d1dbf] border-l-2  border-[#3d1dbf] "
                      : ""
                  } `}
                >
                  <motion.span variants={itemVariants}>
                    {item.title}
                  </motion.span>
                </Link>
              ))}
              <motion.p
                variants={itemVariants}
                className="pl-5 slideUpX py-4 transition-all duration-150 ease-in-out hover:bg-red-600/20
       hover:font-bold  hover:text-lg rounded-r-md"
              >
                Log out
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNavPanel;
