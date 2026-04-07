import Image from "next/image";
import { Mail, Phone, Printer, ChevronDown } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f9ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
      <div className="relative mx-auto grid max-w-[1480px] gap-8 lg:grid-cols-[minmax(0,0.92fr)_520px] lg:items-stretch xl:grid-cols-[minmax(0,0.88fr)_620px]">
        <div className="relative overflow-hidden rounded-[24px] px-6 py-8 sm:px-8 lg:min-h-[680px] lg:px-10">
          <Image
            src="/Contact Us.jpg"
            alt="Contact background"
            fill
            priority
            className="object-cover object-left"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(244,249,255,0.92)_0%,_rgba(244,249,255,0.88)_100%)]" />

          <div className="relative max-w-[720px]">
          <h1 className="text-[2.6rem] font-medium leading-[0.98] tracking-[-0.04em] text-[#343893] sm:text-[3.2rem] lg:text-[4rem]">
            Get in <span className="text-[#12a9df]">Touch</span>
          </h1>

          <p className="mt-5 max-w-[620px] text-[1.05rem] leading-8 text-[#20263a]">
            Have a question or need assistance? Reach out to us via email, phone,
            or the contact form below. We&apos;re eager to assist you.
          </p>

          <p className="mt-4 text-lg font-semibold text-[#12a9df]">Nice hearing from you!</p>

          <form className="mt-8 max-w-[620px] space-y-4">
            <input
              type="text"
              placeholder="Name *"
              className="h-14 w-full rounded-[12px] border border-[#d7e6f4] bg-[#eff7ff]/92 px-4 text-[1rem] text-[#3c4560] outline-none placeholder:text-[#8c98b6]"
            />
            <input
              type="email"
              placeholder="Email"
              className="h-14 w-full rounded-[12px] border border-[#d7e6f4] bg-[#eff7ff]/92 px-4 text-[1rem] text-[#3c4560] outline-none placeholder:text-[#8c98b6]"
            />
            <input
              type="tel"
              placeholder="Phone number *"
              className="h-14 w-full rounded-[12px] border border-[#d7e6f4] bg-[#eff7ff]/92 px-4 text-[1rem] text-[#3c4560] outline-none placeholder:text-[#8c98b6]"
            />
            <textarea
              placeholder="Label"
              rows={5}
              className="w-full rounded-[12px] border border-[#d7e6f4] bg-[#eff7ff]/92 px-4 py-4 text-[1rem] text-[#3c4560] outline-none placeholder:text-[#8c98b6]"
            />

            <div className="relative">
              <select className="h-14 w-full appearance-none rounded-[12px] border border-[#d7e6f4] bg-[#eff7ff]/92 px-4 text-[1rem] text-[#5c6786] outline-none">
                <option>How did you find us?</option>
                <option>Google Search</option>
                <option>Social Media</option>
                <option>Referral</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5c6786]" />
            </div>

            <button className="h-14 w-full rounded-[8px] bg-[linear-gradient(90deg,_#37c5f8_0%,_#0ea0d8_100%)] text-base font-semibold text-white shadow-[0_4px_0_#315063]">
              Send
            </button>
          </form>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-6 w-6 text-[#1ea9de]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3943a5]">
                  Phone
                </p>
                <p className="mt-1 text-sm text-[#1ea9de]">03 5432 1234</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Printer className="mt-1 h-6 w-6 text-[#1ea9de]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3943a5]">
                  Fax
                </p>
                <p className="mt-1 text-sm text-[#1ea9de]">03 5432 1234</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-6 w-6 text-[#1ea9de]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3943a5]">
                  Email
                </p>
                <p className="mt-1 text-sm text-[#1ea9de]">info@marcc.com.au</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="rounded-[18px] border border-white/60 bg-[#1ea9de] p-3 shadow-[0_20px_40px_rgba(35,82,134,0.16)] lg:min-h-[720px]">
          <div className="h-full overflow-hidden rounded-[16px] bg-white">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=London%20Bridge%2C%20London&z=14&output=embed"
              className="h-[620px] w-full border-0 lg:h-[100%] lg:min-h-[690px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
