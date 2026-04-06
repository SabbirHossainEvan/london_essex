"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-30">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/Logo (1) 1.png"
              alt="London & Essex Electrical Training"
              width={360}
              height={72}
              className="h-auto w-[230px] sm:w-[260px] lg:w-[300px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-[#2D3182] font-medium transition-colors hover:text-[#00AEEF] px-1 py-2"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 bottom-0 w-full h-[3px] bg-[#00AEEF]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Buttons Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 border-2 border-[#E5E7EB] text-[#2D3182] font-bold rounded-lg hover:bg-gray-50 transition-all">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#39C5F8] to-[#0193D7] text-white font-bold rounded-lg shadow-md"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#2D3182]">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-[#2D3182] hover:bg-blue-50 rounded-md"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full py-3 border border-gray-200 rounded-lg text-[#2D3182]">Sign In</button>
                <button className="w-full py-3 bg-[#00AEEF] text-white rounded-lg">Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
