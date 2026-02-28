"use client";

import { Badge } from "@/components/ui/badge";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low";
}

const styles = {
  high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  return (
    <Badge variant="outline" className={styles[level]}>
      {level}
    </Badge>
  );
}
