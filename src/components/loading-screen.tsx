"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center mb-6"
      >
        <div className="w-8 h-8 rounded-full bg-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg text-muted-foreground"
      >
        Extracting events from your syllabus...
      </motion.p>
      <p className="text-sm text-muted-foreground/50 mt-2">
        This usually takes a few seconds
      </p>
    </div>
  );
}
