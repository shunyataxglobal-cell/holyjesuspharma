"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ConsultationModal from "@/components/consultation/ConsultationModal";

export default function HeroSection() {

  const [openConsultation, setOpenConsultation] = useState(false);

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero/hero.png"
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover"
          />
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl text-center px-6 text-white">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium tracking-wide"
          >
            Trusted Online Medical Consultation
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight"
          >
            Consultation Delivered to Your
            <span className="block mt-3">
              Doorstep
            </span>

            <span className="block mt-4 text-[var(--color-primary)] font-semibold">
              Anywhere in the World
            </span>
          </motion.h1>

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with certified doctors through secure video, voice, or chat consultations.
            Get prescriptions and medicines delivered safely to your home.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              onClick={() => setOpenConsultation(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:bg-[var(--color-primary)] transition duration-300 flex items-center gap-2 cursor-pointer"
            >
              Start Consultation
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>

        </div>

      </section>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={openConsultation}
        onClose={() => setOpenConsultation(false)}
      />
    </>
  );
}