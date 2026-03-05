"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "John Matthews",
    role: "Patient",
    image: "/images/services/video.jpg",
    review:
      "The consultation process was smooth and professional. I received my prescription within minutes and medicines were delivered on time.",
  },
  {
    name: "Sophia Clark",
    role: "Patient",
    image: "/images/services/voice.jpg",
    review:
      "Highly secure and confidential platform. The doctors were knowledgeable and extremely helpful throughout the consultation.",
  },
  {
    name: "Michael Smith",
    role: "Patient",
    image: "/images/services/chat.jpg",
    review:
      "Very convenient service. I was able to chat with a certified doctor instantly and get the right treatment guidance.",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = testimonials[index];

  return (
    <section className="relative py-25 bg-[var(--color-beige)] from-white to-[var(--color-beige)] overflow-hidden">

      {/* Soft Glow Background */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* Section Heading */}
       
         <span className="block mt-3 text-7xl">
            What Our
          </span>

          <span className="block mt-2 mb-5 text-[var(--color-primary)] font-semibold text-6xl">
            Patients Say
          </span>

        {/* Big Quote Icon */}
        <Quote className="w-20 h-20 text-[var(--color-primary)]/20 mx-auto mb-10" />

        {/* Animated Testimonial */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-12 backdrop-blur-xl"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8 text-[var(--color-primary)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-700 text-xl leading-relaxed mb-12">
              “{current.review}”
            </p>

            {/* User */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-[var(--color-primary)]/30">
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h4 className="text-lg font-semibold text-[var(--color-dark)]">
                {current.name}
              </h4>
              <p className="text-sm text-gray-600">{current.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}