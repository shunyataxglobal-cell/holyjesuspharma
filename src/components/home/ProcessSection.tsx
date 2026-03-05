"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Submit Your Details",
    description:
      "Provide your medical information securely through our online form.",
  },
  {
    title: "Medical Review",
    description:
      "Our licensed doctors carefully review your medical history.",
  },
  {
    title: "Doctor Consultation",
    description:
      "Connect with a certified doctor via video, voice, or chat.",
  },
  {
    title: "Prescription Decision",
    description:
      "Doctor provides a professional prescription if approved.",
  },
  {
    title: "Payment & Delivery",
    description:
      "Complete payment and receive medicines at your doorstep.",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-36 bg-[var(--color-beige)] overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">

          <span className="block mt-3 text-8xl">
            How 
          </span>

          <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl">
             It Works
          </span>
          <p className="mt-6 text-gray-600 text-lg">
            A simple and secure process from consultation to delivery.
          </p>
        </div>

        {/* Center Vertical Line */}
        <div className="absolute left-1/2 top-0 h-full w-2 bg-[var(--color-primary)]/20 hidden md:block"></div>

        <div className="space-y-24 relative">

          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >

                {/* Card */}
                <div
                  className={`relative bg-[var(--color-beige)] shadow-xl rounded-3xl p-10 w-full md:w-[45%] ${
                    isLeft ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <div className="absolute -top-6 left-6 bg-[var(--color-primary)] text-white w-12 h-12 flex items-center justify-center rounded-full font-bold shadow-lg">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-semibold text-[var(--color-dark)] mb-4 mt-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}