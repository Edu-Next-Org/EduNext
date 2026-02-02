"use client"

import Lottie from "lottie-react"
import login1 from "../../assets/Lottie/Login.json"
import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

export default function LoginGif() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center md:items-start text-center md:text-left px-2"
    >
      <motion.span variants={itemVariants} className="text-[#000] font-bold text-[28px] md:text-[40px] leading-tight dark:text-[white]">
        Welcome Back!
      </motion.span>
      <motion.span variants={itemVariants} className="text-gray-600 mt-2 text-sm md:text-base dark:text-[#898989]">
        Login to your account to continue learning
      </motion.span>
      
      <motion.div variants={itemVariants} className="w-full max-w-[400px] md:max-w-none">
        <Lottie
         
          className="w-full h-auto md:w-[700px] md:h-[500px]"
          animationData={login1}
          loop={true}
        />
      </motion.div>
    </motion.div>
  )
}
 
