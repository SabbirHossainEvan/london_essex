"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface AnimatedProgressBarProps {
  value: number;
  className?: string;
  fillClassName?: string;
}

export default function AnimatedProgressBar({
  value,
  className = "h-3 rounded-full bg-[#ebf2f8]",
  fillClassName = "h-3 rounded-full bg-[#1ea6df]",
}: AnimatedProgressBarProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }} // Springy ease
        className={`relative ${fillClassName}`}
      >
        {/* Shimmer Effect */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "linear",
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

export function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = Math.round(latest).toString() + "%";
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return <span ref={ref}>0%</span>;
}
