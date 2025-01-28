"use client";

import { motion } from "motion/react";
export default function Home() {
  
  return (
    <div className="w-full max-w-full flex items-center justify-center">
      <motion.h2 className="text-center text-5xl mt-60 flex gap-5">
        <motion.span initial={{y:20,opacity: 0}} animate={{y:0,opacity: 1}} transition={{duration: .3}}>Plan.</motion.span>
        <motion.span initial={{y:20,opacity: 0}} animate={{y:0,opacity: 1}} transition={{duration: .3,delay:.4}}>Prioritize.</motion.span>
        <motion.span initial={{y:20,opacity: 0}} animate={{y:0,opacity: 1}} transition={{duration: .3,delay: .8}}>Prosper.</motion.span>
      </motion.h2>

    </div>
    
  );
}
