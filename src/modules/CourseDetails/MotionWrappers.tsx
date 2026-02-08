'use client';

import { motion } from 'framer-motion';
import React from 'react';


export const StaggerWrapper = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) => {
  return (
    <motion.main
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2, 
            delayChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.main>
  );
};


export const FadeInItem = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 }, 
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 50, duration: 0.5 }
        }
      }}
    >
      {children}
    </motion.div>
  );
};