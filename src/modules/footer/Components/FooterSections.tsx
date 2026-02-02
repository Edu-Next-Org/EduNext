"use client";
import React from "react";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FooterSection } from "../types/FooterSection";

type Tprops = {
  sections: FooterSection[];
  copyright: string;
};
function FooterSections({ sections, copyright }: Tprops) {
  const footerColumn: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        staggerChildren: 0.1,
      },
    },
  };
  const footerItem: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <footer className=" bg-[#ffff] dark:bg-[#1e1e1e]  ">
      <div className="max-w-7xl mx-auto px-6 md:px-20  py-6">
        <motion.div
          variants={footerColumn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 "
        >
          {sections.map((section, index) => (
            <div key={index}>
              <motion.h3
                variants={footerItem}
                className="font-semibold text-lg mb-4 pb-2 border-b border-[#bbbb]"
              >
                {section.heading}
              </motion.h3>

              {section.links && (
                <ul className=" text-gray-600 flex flex-col gap-4">
                  {section.links.map((link, i) => (
                    <motion.span variants={footerItem} key={i}>
                      <Link
                        href={link.href}
                        className="hover:text-blue-500 transition"
                      >
                        {link.title}
                      </Link>
                    </motion.span>
                  ))}
                </ul>
              )}

              {section.icons && (
                <div className="flex  gap-4 text-gray-600">
                  {section.icons.map((icon, i) => (
                    <motion.span
                      variants={footerItem}
                      key={i}
                      className="hover:text-blue-600 transition"
                    >
                      {icon}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <div className="border-t border-gray-200 mt-4 pt-3 text-center text-sm text-gray-500">
          {copyright}
        </div>
      </div>
    </footer>
  );
}

export default FooterSections;
