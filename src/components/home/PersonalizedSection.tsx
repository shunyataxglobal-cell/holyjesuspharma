"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function PersonalizedSection() {
  return (
    <section className="relative py-20 bg-[var(--color-beige)] overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight mb-8">
            Personalized Healthcare
            <span className="block text-[var(--color-primary)] mt-2">
              Designed Around You
            </span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            Our platform connects you with certified doctors who understand your
            unique health needs. Every consultation is tailored to provide
            accurate diagnosis, safe prescriptions, and convenient delivery —
            all from the comfort of your home.
          </p>

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/services/image-1.png"
            alt="Personalized Care"
            fill
            className="object-cover"
          />

          {/* Soft Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>

      </div>
    </section>
  );
}