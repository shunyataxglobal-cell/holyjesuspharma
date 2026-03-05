"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-36 overflow-hidden bg-gradient-to-r from-[var(--color-primary)]/90 to-[var(--color-secondary)]/90 text-white">

      {/* Soft Glow Background */}
      <div className="absolute -top-20 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          Ready to Start Your Online Consultation?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 text-lg text-white/90"
        >
          Connect with certified doctors today and receive expert care from the comfort of your home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:bg-white hover:text-black transition duration-300 flex items-center gap-2 cursor-pointer"
          >
            Start Consultation
            <ArrowRight size={18} />
          </motion.button>

        
        </motion.div>

      </div>
    </section>
  );
}