"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jenny Wilson",
    role: "Designer",
    image: "https://i.pravatar.cc/150?u=jenny",
    text: "When an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    rating: 5,
  },
  {
    id: 2,
    name: "Guy Hawkins",
    role: "Developer",
    image: "https://i.pravatar.cc/150?u=guy",
    text: "It is a long established fact that a reader will be distracted by readable content when looking at a layout.",
    rating: 5,
  },
];

const marqueeVariants = {
  animate: {
    x: [0, -1035],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 20,
        ease: "linear" as const,
      },
    },
  },
};

const Testimonials = () => {
  return (
    <section className="overflow-hidden bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-600">
            Our Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-800 md:text-4xl">
            London & Essex Reviews
          </h2>
          <p className="mt-2 text-slate-500">See what our students say</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-3xl shadow-xl lg:col-span-5">
            <Image
              src="/hero-1.png"
              alt="Students learning"
              width={600}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="lg:col-span-7">
            <span className="mb-4 inline-block rounded-full bg-cyan-100 px-4 py-1 text-sm font-semibold text-cyan-600">
              Our Testimonials
            </span>
            <h3 className="mb-8 text-3xl font-bold leading-tight text-slate-800">
              What Students Think And Say About SkillGrow
            </h3>

            <div className="relative w-full overflow-hidden">
              <motion.div className="flex gap-6" variants={marqueeVariants} animate="animate">
                {[...testimonials, ...testimonials].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative min-w-[320px] rounded-2xl border border-sky-100 bg-sky-50 p-8 md:min-w-[450px]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="mb-2 font-semibold text-indigo-600">Great Quality!</p>
                        <div className="flex text-orange-400">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={20} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <Quote size={48} className="text-slate-200" />
                    </div>

                    <p className="mb-8 text-lg italic text-slate-600">
                      &quot;{item.text}&quot;
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <p className="text-sm text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((dot, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === 0 ? "w-4 bg-cyan-500" : "bg-slate-300"}`}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <button className="rounded-full border border-sky-200 p-3 text-sky-500 transition-colors hover:bg-sky-500 hover:text-white">
                  <ArrowLeft size={24} />
                </button>
                <button className="rounded-full border border-sky-200 p-3 text-sky-500 transition-colors hover:bg-sky-500 hover:text-white">
                  <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
