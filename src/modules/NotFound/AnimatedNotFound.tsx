"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  colorClass: string;
  size: number;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  duration: number;
  scaleStart: number;
  scaleEnd: number;
  opacityStart: number;
  opacityEnd: number;
}

export default function AnimatedNotFound() {
  const [isMounted, setIsMounted] = useState(false);

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      colorClass:
        i % 3 === 0
          ? "bg-violet-300/40 dark:bg-purple-500"
          : i % 3 === 1
            ? "bg-cyan-300/40 dark:bg-cyan-400"
            : "bg-blue-300/40 dark:bg-blue-600",
      size: Math.random() * 20 + 5,
      xStart: Math.random() * 1000 - 500,
      yStart: Math.random() * 800 - 400,
      xEnd: Math.random() * 1200 - 600,
      yEnd: Math.random() * 1000 - 500,
      duration: Math.random() * 10 + 10,
      scaleStart: Math.random() * 0.5 + 0.5,
      scaleEnd: Math.random() * 1.5 + 0.5,
      opacityStart: Math.random() * 0.2 + 0.1,
      opacityEnd: Math.random() * 0.5 + 0.3,
    })),
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-[#030305] dark:text-white">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {isMounted &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: p.xStart,
                y: p.yStart,
                scale: p.scaleStart,
                opacity: p.opacityStart,
              }}
              animate={{
                x: [p.xStart, p.xEnd, p.xStart],
                y: [p.yStart, p.yEnd, p.yStart],
                scale: [p.scaleStart, p.scaleEnd, p.scaleStart],
                opacity: [p.opacityStart, p.opacityEnd, p.opacityStart],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[3px] ${p.colorClass}`}
              style={{ width: p.size, height: p.size }}
            />
          ))}
      </div>

      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-violet-300/30 dark:border-cyan-500/20 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full border border-fuchsia-300/30 dark:border-purple-500/20"
          style={{ borderStyle: "dotted" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full border-2 border-sky-300/20 dark:border-blue-500/10 border-dashed"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          animate={{
            y: [-15, 15, -15],
            textShadow: [
              "0px 0px 20px rgba(138, 43, 226, 0.4), 0px 0px 40px rgba(0, 255, 255, 0.2)",
              "0px 0px 40px rgba(138, 43, 226, 0.8), 0px 0px 80px rgba(0, 255, 255, 0.6)",
              "0px 0px 20px rgba(138, 43, 226, 0.4), 0px 0px 40px rgba(0, 255, 255, 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[150px] md:text-[220px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 dark:from-white dark:via-gray-200 dark:to-gray-600 select-none drop-shadow-2xl"
        >
          404
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.5 },
            },
          }}
          className="flex flex-col items-center"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="mt-2 text-3xl font-bold tracking-widest text-slate-900 uppercase md:text-4xl dark:text-white"
          >
            Signal Lost
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="max-w-lg mt-6 text-base text-slate-600 md:text-lg dark:text-gray-400"
          >
            You have drifted too far into the digital void. The page you are
            looking for is outside our current orbit.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="flex flex-col items-center gap-5 mt-12 sm:flex-row"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className=" cursor-pointer relative group px-8 py-4 font-bold text-white bg-slate-900 rounded-full overflow-hidden dark:text-black dark:bg-white"
              >
                <span className="relative z-10">Return to Base</span>
                <div className="absolute inset-0 w-full h-full transition-opacity duration-300 opacity-0 bg-gradient-to-r from-cyan-300 to-purple-400 group-hover:opacity-100" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className=" cursor-pointer px-8 py-4 font-bold text-slate-900 transition-all border rounded-full border-slate-300 hover:border-slate-500 hover:bg-slate-900/5 dark:text-white dark:border-white/20 dark:hover:border-white/50 dark:hover:bg-white/10"
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
