// // import Layouts from "@/components/Layouts/Layouts";
// // import Image from "next/image";
// // import HeroCount from "./HeroCount";
// // import Link from "next/link";

// // function HeroSection() {
// //   return (
// //     <div className="">
// //       <section className="relative w-full h-[80vh] flex items-center bg-white overflow-hidden">
// //         <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-25 py-12 z-10">
// //           <div className="max-w-xl">
// //             <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
// //               Learn from Experts, <br /> Master Your Skills
// //             </h1>

// //             <p className="text-lg lg:text-xl mb-8 text-gray-700">
// //               Join our top-rated courses and boost your career!
// //             </p>

// //             <div className="flex gap-4">
// //               <Link
// //                 href="/courses"
// //                 className=" cursor-pointer py-3 px-6 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 transition"
// //               >
// //                 Browse Courses
// //               </Link>
// //               <Link
// //                 href="/auth/register"
// //                 className=" cursor-pointer py-3 px-6 border-2 border-gray-900 rounded-lg font-bold hover:bg-gray-100 transition dark:text-[black]"
// //               >
// //                 Get Started
// //               </Link>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="hidden lg:block w-1/2 h-full relative">
// //           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 " />

// //           <Image
// //             src="/images/hero.png"
// //             alt="learn"
// //             fill
// //             className="object-cover object-center"
// //             priority
// //           />
// //         </div>
// //       </section>
// //       <div className="lg:px-20 px-6 py-3  bg-[#eeee] dark:bg-[#1e1e1e] ">
// //         <div className="mx-auto  bg-[#ffff] rounded shadow lg:w-[75%] relative bottom-10 ">
// //           <Layouts>
// //             <HeroCount />
// //           </Layouts>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default HeroSection;

"use client";

import {
  motion,
  useReducedMotion,
  Variants,
  TargetAndTransition,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import HeroCount from "./HeroCount";

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const floatMotion: TargetAndTransition | undefined = shouldReduceMotion
    ? undefined
    : {
        y: [0, -12, 0],
        rotate: [0, 1.5, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  const shimmerMotion: TargetAndTransition | undefined = shouldReduceMotion
    ? undefined
    : {
        x: ["-20%", "120%"],
        opacity: [0, 0.9, 0],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.8,
        },
      };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#0b0b0f] ">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.12),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.08),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <section className="relative min-h-[80vh] lg:min-h-[92vh] flex items-center">
        <div className=" w-full  lg:px-20 px-6 py-8 md:py-16 ">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div
              className="relative z-10 max-w-xl"
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-violet-300"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.85)]" />
                Learn smarter. Build faster. Grow confidently.
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={0.08}
                className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
              >
                <span className="block">Learn from Experts,</span>
                <span className="relative mt-2 block">
                  Master Your Skills
                  <span className="absolute -bottom-2 left-0 h-3 w-full rounded-full bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-transparent blur-md" />
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={0.18}
                className="mt-6 text-base leading-8 text-slate-600 sm:text-lg lg:text-xl dark:text-slate-300"
              >
                Join top-rated courses, learn from real experts, and turn your
                time into a career advantage with a smoother, more focused
                learning journey.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={0.28}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  href="/courses"
                  className="group inline-flex items-center justify-center rounded-2xl bg-violet-600 hover:bg-violet-700 px-3 sm:px-7 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(139,92,246,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(139,92,246,0.36)] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  Browse Courses
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/80 px-3 sm:px-7 py-4 font-semibold text-slate-900 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            <div className="relative">
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 z-10 hidden h-full w-28 -translate-x-1/2 skew-x-[-14deg] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent blur-3xl lg:block"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        x: [-18, 18, -18],
                        opacity: [0.25, 0.7, 0.25],
                        scaleY: [1, 1.08, 1],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />

              <motion.div
                className="relative mx-auto w-full max-w-[680px]"
                animate={floatMotion}
              >
                <div className="absolute -inset-4 rounded-[2.2rem] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/50 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <div className="relative aspect-[4.6/4.6] w-full overflow-hidden rounded-[1.5rem] bg-slate-100 dark:bg-slate-900">
                    <Image
                      src="/images/reza.JPG"
                      alt="Learn from experts"
                      fill
                      priority
                      className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/35 to-transparent dark:from-black/20" />

                    {/* <motion.div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-[-35%] w-2/5 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-2xl"
                      animate={shimmerMotion}
                    /> */}

                    <motion.div
                      className="absolute left-4 top-4 rounded-2xl border border-white/25 bg-white/80 px-4 py-3 text-slate-900 shadow-lg backdrop-blur-md dark:bg-black/40 dark:text-white"
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              y: [0, -8, 0],
                              x: [0, 4, 0],
                            }
                      }
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : {
                              duration: 4.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                    >
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-300">
                        Live learning
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        Expert-led classes
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute bottom-5 right-5 rounded-2xl border border-white/25 bg-slate-950/70 px-4 py-3 text-white shadow-lg backdrop-blur-md"
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              y: [0, 10, 0],
                              x: [0, -4, 0],
                            }
                      }
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : {
                              duration: 5.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.4,
                            }
                      }
                    >
                      <div className="text-xs font-medium text-white/70">
                        Top pick
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        Career-focused courses
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 top-10 hidden h-20 w-20 rounded-full border border-violet-500/25 bg-violet-500/10 blur-[1px] lg:block"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, 14, 0],
                        x: [0, 8, 0],
                        scale: [1, 1.08, 1],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 bottom-16 hidden h-16 w-16 rounded-full border border-cyan-500/25 bg-cyan-500/10 lg:block"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -10, 0],
                        x: [0, -6, 0],
                        rotate: [0, 12, 0],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 6.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6,
                      }
                }
              />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 px-6 lg:px-20 -mt-10 pb-16 ">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/60 bg-white/80 mt-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0f]/80">
          <HeroCount />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
