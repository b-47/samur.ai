"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Samur<span className="text-primary">.ai</span>
        </h1>
        <p className="text-2xl text-muted-foreground mb-2">
          Cut through the clutter.
        </p>
        <p className="text-lg text-muted-foreground/70 mb-10">
          Turn your syllabus into calendar events in seconds.
          Paste, extract, export.
        </p>
        <Button
          size="lg"
          onClick={onGetStarted}
          className="text-lg px-8 py-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
        >
          Get Started
        </Button>
        <p className="mt-6 text-sm text-muted-foreground/50">
          Focus, sharpened.
        </p>
      </motion.div>
    </div>
  );
}
