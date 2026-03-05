"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function WhyChooseSection() {
  return (
    <section className="relative py-32 bg-[var(--color-beige)] overflow-hidden">

      {/* Soft Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">

        {/* LEFT SIDE – IMAGE COLLAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative h-[520px]"
        >
          {/* Main Image */}
          <div className="absolute top-0 left-0 w-[90%] h-[380px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/WhyChooseUs/doctor-1.png"
              alt="Doctor"
              fill
              className="object-cover"
            />
          </div>

          {/* Small Floating Image */}
          <div className="absolute bottom-0 right-0 w-[65%] h-[280px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src="/images/WhyChooseUs/doctor-2.png"
              alt="Consultation"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating Stat Card */}
          <div className="absolute top-10 right-10 bg-white px-6 py-4 rounded-2xl shadow-xl ">
            <h4 className="text-2xl font-bold text-[var(--color-dark)]">
              10K+
            </h4>
            <p className="text-sm text-gray-600">
              Happy Patients
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE – CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="block mt-3 text-7xl">
            Why Choose
          </span>

          <span className="block mt-2 mb-5 text-[var(--color-primary)] font-semibold text-6xl">
            Holy Jesus Pharma?
          </span>
          

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
           Worldwide Medicine Delivery
100% Genuine & Quality-Checked Medicines
Secure Packaging & Discreet Shipping
Affordable Prices, No Hidden Costs
24/7 Customer Support
Free Shipping on All Orders
          </p>

          <div className="space-y-6">

            {[
              "Certified & Experienced Doctors",
              "Secure & Confidential Consultations",
              "Fast Prescription & Delivery",
              "Affordable & Transparent Pricing",
              "24/7 Customer Support",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="text-[var(--color-primary)] w-6 h-6 mt-1" />
                <span className="text-gray-700 text-lg">{item}</span>
              </div>
            ))}

          </div>
        </motion.div>

      </div>
    </section>
  );
}