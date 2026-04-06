"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
};

type FooterContact = {
  type: "phone" | "email";
  label: string;
  href: string;
};

type FooterSocial = {
  platform: "x" | "facebook" | "linkedin" | "youtube";
  href: string;
};

type FooterSectionProps = {
  companyTitle?: string;
  legalLinks?: FooterLink[];
  contacts?: FooterContact[];
  socials?: FooterSocial[];
  copyrightText?: string;
};

function SocialIcon({ platform }: { platform: FooterSocial["platform"] }) {
  if (platform === "facebook") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d6fe2] text-[1.35rem] font-bold text-white">
        f
      </span>
    );
  }

  if (platform === "linkedin") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#1d6fe2] text-[1.1rem] font-bold text-white">
        in
      </span>
    );
  }

  if (platform === "youtube") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[#ff140f] text-[0.8rem] font-bold text-white">
        &gt;
      </span>
    );
  }

  return <span className="text-[2rem] font-medium leading-none text-[#151515]">X</span>;
}

export default function FooterSection({
  companyTitle = "Company",
  legalLinks = [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Booking Terms & Conditions", href: "#" },
  ],
  contacts = [
    { type: "phone", label: "(207) 555-0119", href: "tel:+12075550119" },
    {
      type: "email",
      label: "sara.cruz@example.com",
      href: "mailto:sara.cruz@example.com",
    },
  ],
  socials = [
    { platform: "x", href: "#" },
    { platform: "facebook", href: "#" },
    { platform: "linkedin", href: "#" },
    { platform: "youtube", href: "#" },
  ],
  copyrightText = "Copyright \u00A9 2025 London & Essex. All rights reserved.",
}: FooterSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#eef7fd]"
    >
      <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.6fr_0.7fr] lg:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.08, duration: 0.6 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className="flex items-start"
          >
            <Link href="/" className="inline-flex">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/Logo (1) 1.png"
                  alt="London & Essex Electrical Training"
                  width={420}
                  height={84}
                  className="h-auto w-[250px] sm:w-[300px] lg:w-[360px]"
                />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.14, duration: 0.6 }}
          >
            <h3 className="text-[2rem] font-semibold tracking-tight text-[#2D3182]">
              {companyTitle}
            </h3>
            <div className="mt-6 flex flex-col gap-6">
              {legalLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.18 + index * 0.06, duration: 0.45 }}
                >
                  <Link
                    href={link.href}
                    className="text-[1.55rem] leading-none text-[#252525] transition-colors hover:text-[#2D3182]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-[2rem] font-semibold tracking-tight text-[#2D3182]">
              {companyTitle}
            </h3>

            <div className="mt-6 flex flex-col gap-6">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.label}
                  initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.24 + index * 0.07, duration: 0.45 }}
                >
                  <Link
                    href={contact.href}
                    className="group flex items-center gap-4 text-[1.45rem] text-[#252525]"
                  >
                    <motion.span
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              rotate: contact.type === "phone" ? -12 : 8,
                              scale: 1.08,
                            }
                      }
                      className="inline-flex"
                    >
                      {contact.type === "phone" ? (
                        <Phone className="h-6 w-6 text-[#2D3182]" />
                      ) : (
                        <Mail className="h-6 w-6 text-[#2D3182]" />
                      )}
                    </motion.span>
                    <span className="transition-colors group-hover:text-[#2D3182]">
                      {contact.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center gap-5 pt-1">
                {socials.map((social, index) => (
                  <motion.div
                    key={social.platform}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.9 }}
                    transition={{ delay: 0.34 + index * 0.05, duration: 0.35 }}
                    whileHover={reduceMotion ? undefined : { y: -4, scale: 1.08 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    <Link href={social.href} aria-label={social.platform}>
                      <SocialIcon platform={social.platform} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={reduceMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-[#18a8df] px-4 py-3 text-center text-[1rem] text-white sm:text-[1.1rem]"
      >
        {copyrightText}
      </motion.div>
    </motion.footer>
  );
}
