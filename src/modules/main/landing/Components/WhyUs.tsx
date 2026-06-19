"use client";
import Lottie from "lottie-react";
import LearnAn from "../../../../assets/Lottie/Learning.json";
import CretificateAn from "../../../../assets/Lottie/Cerificate.json";
import UserAn from "../../../../assets/Lottie/user.json";
import { motion, Variants } from "framer-motion";

function WhyUs() {
  const whyColumn: Variants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 18,
        staggerChildren: 0.5,
      },
    },
  };
  const whyItem: Variants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-12 md:gap-0 md:justify-between items-center ">
      <motion.div
        variants={whyColumn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        className="flex flex-col gap-3 items-center flex-1/3"
      >
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={UserAn} loop={true} />
        </div>
        <motion.h2 variants={whyItem} className="font-bold text-xl ">
          Expert Instruction
        </motion.h2>
        <motion.h3 variants={whyItem}>Learning from industry leaders</motion.h3>
      </motion.div>
      <motion.div
        variants={whyColumn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        className="flex flex-col gap-3 items-center flex-1/3 "
      >
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={LearnAn} loop={true} />
        </div>
        <motion.h2 variants={whyItem} className="font-bold text-xl ">
          Flexible Learning{" "}
        </motion.h2>
        <motion.h3 variants={whyItem}>Study anytime , anyWhere</motion.h3>
      </motion.div>
      <motion.div
        variants={whyColumn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        className="flex flex-col gap-3 items-center flex-1/3 "
      >
        <div className="w-[40%] h-[40%] rounded-full bg-[#ffff] ">
          <Lottie animationData={CretificateAn} loop={true} />
        </div>
        <motion.h2 variants={whyItem} className="font-bold text-xl ">
          Certifications
        </motion.h2>
        <motion.h3 variants={whyItem}>Earn recognize certificates</motion.h3>
      </motion.div>
    </div>
  );
}

export default WhyUs;
