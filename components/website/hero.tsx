"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Star, Award, Users, Clock } from "lucide-react";

const stats = [
  { label: "Students Trained", value: "20K+", icon: Users },
  { label: "Star Rating", value: "4.9", icon: Star },
  { label: "Pass Rate", value: "98%", icon: Award },
  { label: "Years Experience", value: "18+", icon: Clock },
];

const categories = ["Gas Engineer", "Electrical", "Plumbing", "Renewables"];

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-10 lg:pb-30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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

            <p className="mt-10 text-xl text-gray-600 max-w-xl leading-relaxed">
              Professional electrician, gas, and plumbing training delivered by expert instructors in state-of-the-art facilities.
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-md">
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
            <div className="mt-10 flex flex-wrap gap-4">
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
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-black text-[#2D3182] tracking-tight">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-[0.2em] leading-tight">
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
            className="relative h-[700px] w-full hidden lg:flex items-center justify-center -mr-20"
          >
            <div className="relative w-full h-full lg:scale-125">
              <img
                src="/hero-collage.png"
                alt="Construction Training Collage"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
