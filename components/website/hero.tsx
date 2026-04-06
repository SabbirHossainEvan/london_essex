"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Star, Award, Users, Clock } from "lucide-react";

const stats = [
  { label: "Students Trained", value: 20, suffix: "K+", decimals: 0, icon: Users },
  { label: "Star Rating", value: 4.9, suffix: "", decimals: 1, icon: Star },
  { label: "Pass Rate", value: 98, suffix: "%", decimals: 0, icon: Award },
  { label: "Years Experience", value: 18, suffix: "+", decimals: 0, icon: Clock },
];

const categories = ["Gas Engineer", "Electrical", "Plumbing", "Renewables"];

const AnimatedStat = ({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 2600;
    const startTime = performance.now();

    let frameId = 0;

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue);
      }
    };

    frameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-12 pb-20 sm:pt-15 lg:pt-25 lg:pb-30">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,640px)_minmax(560px,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,700px)_minmax(580px,1fr)]">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[700px]"
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-[#2D3182] leading-[1.05]">
              Find the right construction training{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white px-2">course</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute inset-0 bg-[#00AEEF] rounded-lg -rotate-1 origin-left"
                />
              </span>{" "}
              and book your place today.
            </h1>

            <p className="mt-10 max-w-[640px] text-xl leading-relaxed text-gray-600">
              Professional electrician, gas, and plumbing training delivered by expert instructors in state-of-the-art facilities.
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-[520px]">
              <div className="relative flex items-center p-1 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100/50">
                <div className="flex-1 flex items-center px-4">
                  <Search className="text-gray-400 mr-2" size={20} />
                  <input
                    type="text"
                    placeholder="Find a course..."
                    className="w-full py-4 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-lg"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-[#39C5F8] to-[#0193D7] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg transition-shadow whitespace-nowrap">
                  <span>Find Courses</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-10 flex max-w-[640px] flex-wrap gap-4">
              <span className="text-sm font-bold text-[#2D3182]/50 uppercase tracking-widest mr-2 self-center">
                Popular:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-semibold text-[#2D3182] hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 text-center sm:mt-20 sm:gap-x-10 sm:gap-y-12 md:mt-24 md:grid-cols-4 md:gap-12 md:text-left">
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col items-center md:items-start">
                  <div className="text-[2.25rem] font-black leading-none tracking-tight text-[#2D3182] sm:text-4xl">
                    <AnimatedStat
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div className="mt-2 max-w-[9rem] text-[0.72rem] font-bold leading-[1.2] uppercase tracking-[0.14em] text-gray-400 sm:text-xs sm:tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Hero Image (Single Image Replication) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden h-[680px] w-full items-center justify-center lg:flex"
          >
            <div className="relative h-full w-full lg:translate-x-4 lg:scale-[1.03] xl:translate-x-8">
              <img
                src="/hero-collage.png"
                alt="Construction Training Collage"
                className="mt-6 h-full w-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
