"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Users, Heart, Award, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative py-36 bg-gradient-to-br from-[var(--color-beige)] to-white text-center">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-6">
          <p className="uppercase tracking-widest text-gray-500 text-sm">
            About Our Organization
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight">
            Committed to Delivering
            <span className="block text-[var(--color-primary)]">
              Trusted Digital Healthcare
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-600 max-w-3xl mx-auto">
            A secure online platform connecting patients with licensed medical professionals worldwide.
          </p>
        </div>
      </section>

 {/* ================= WHO WE ARE ================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Who 
              <span className="text-[var(--color-primary)]"> We Are</span>
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Our vision is to redefine how healthcare is delivered in the digital age by building a globally trusted telemedicine ecosystem rooted in ethics, compliance, and medical integrity. We envision a future where patients can access licensed doctors, verified medical information, and safe treatment pathways without fear, stigma, or uncertainty. We aspire to become a long-term healthcare partner for individuals seeking responsible medical support across various health conditions. By integrating technology with human medical expertise, we aim to reduce barriers to care while maintaining the highest standards of professional accountability.
            </p>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Our vision is not to replace traditional healthcare systems, but to complement them through secure, accessible, and doctor-led digital solutions. As healthcare continues to evolve, we remain focused on innovation that enhances patient outcomes rather than commercial gain. We envision a platform where every medical decision is rooted in science, every consultation respects patient autonomy, and every outcome reflects ethical medical practice.
            </p>
          </div>

          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/about/image-1.png"
              alt="Healthcare"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>
      

      {/* ================= MISSION & VISION ================= */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-32">

          {/* Mission */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/about/image-2.png" alt="Mission" fill className="object-cover" />
            </div>

            <div>
              <h2 className="text-4xl font-bold">
                Our
                <span className="text-[var(--color-primary)]"> Mission</span>
              </h2>

              <p className="mt-8 text-gray-600 leading-relaxed">
                Our vision is to redefine how healthcare is delivered in the digital age by building a globally trusted telemedicine ecosystem rooted in ethics, compliance, and medical integrity. We envision a future where patients can access licensed doctors, verified medical information, and safe treatment pathways without fear, stigma, or uncertainty. We aspire to become a long-term healthcare partner for individuals seeking responsible medical support across various health conditions. By integrating technology with human medical expertise, we aim to reduce barriers to care while maintaining the highest standards of professional accountability. 
              </p>
              
              <p className="mt-8 text-gray-600 leading-relaxed">
                Our vision is not to replace traditional healthcare systems, but to complement them through secure, accessible, and doctor-led digital solutions. As healthcare continues to evolve, we remain focused on innovation that enhances patient outcomes rather than commercial gain. We envision a platform where every medical decision is rooted in science, every consultation respects patient autonomy, and every outcome reflects ethical medical practice.
              </p>

            </div>
          </div>

          {/* Vision */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold">
                Our
                <span className="text-[var(--color-primary)]"> Vision</span>
              </h2>

              <p className="mt-8 text-gray-600 leading-relaxed">
                Our mission is to create a safe, ethical, and technology-driven healthcare platform that puts patients first at every stage of their medical journey. We believe that access to qualified medical care should not be limited by geography, hesitation, or lack of clarity. Through our telemedicine-led approach, we aim to connect individuals with licensed medical professionals who provide unbiased, clinically sound guidance based solely on medical necessity. We are committed to delivering healthcare in a responsible and transparent manner. Every consultation, medical review, and prescription decision is guided by strict clinical standards, patient safety protocols, and regulatory compliance. We do not promote medicines directly, and we do not allow commercial interests to influence medical decisions.
              </p>

<p className="mt-8 text-gray-600 leading-relaxed">
Our systems are designed to ensure that treatment options are discussed only after a thorough medical evaluation by a licensed doctor. At the core of our mission is trust. We prioritize patient privacy, data security, and confidentiality at all times. By operating on HIPAA- and GDPR-compliant systems, we ensure that personal and medical information is protected using industry-grade safeguards. Our mission is not only to provide care, but to create confidence, dignity, and reassurance for every patient who chooses our platform.              </p>

            </div>

            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image src="/images/about/image-3.png" alt="Vision" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ================= CORE VALUES (PREMIUM) ================= */}
<section className="relative py-32 bg-gradient-to-b from-[var(--color-beige)] to-white overflow-hidden">

  <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

  <div className="relative max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-20">
      Our Core Values
    </h2>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          icon: ShieldCheck,
          title: "Security & Privacy",
          desc: "End-to-end encrypted consultations with strict confidentiality.",
        },
        {
          icon: Users,
          title: "Certified Doctors",
          desc: "Verified and licensed specialists across multiple disciplines.",
        },
        {
          icon: Heart,
          title: "Patient First",
          desc: "Your safety, trust, and well-being are our top priorities.",
        },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            whileHover={{ y: -15 }}
            className="group relative bg-white p-12 rounded-3xl shadow-xl border border-gray-100 transition duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition duration-300"></div>

            <div className="relative">
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 mb-6">
                <Icon className="text-[var(--color-primary)]" size={26} />
              </div>

              <h4 className="font-semibold text-xl">{item.title}</h4>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>

      {/* ================= OUR JOURNEY (PREMIUM TIMELINE) ================= */}
<section className="relative py-32 bg-white overflow-hidden">

  <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[var(--color-primary)]/30 hidden md:block"></div>

  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-24">
      Our Journey
    </h2>

    <div className="space-y-24">

      {[
        "Founded with a vision to modernize telemedicine.",
        "Expanded across multiple medical specialties.",
        "Built an international licensed doctor network.",
        "Serving thousands of patients globally today.",
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative md:w-1/2 ${
            i % 2 === 0 ? "md:ml-auto md:text-left" : "md:mr-auto md:text-right"
          }`}
        >
          <div className="bg-[var(--color-beige)] p-8 rounded-3xl shadow-lg">
            <p className="text-gray-700">{item}</p>
          </div>

          <div className="absolute top-6 -left-4 md:left-auto md:-right-4 w-6 h-6 bg-[var(--color-primary)] rounded-full border-4 border-white"></div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* ================= PROFESSIONAL STANDARDS ================= */}
<section className="relative py-32 bg-gradient-to-br from-[var(--color-beige)] to-white overflow-hidden">

  <div className="absolute -bottom-32 left-0 w-[600px] h-[600px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

  <div className="relative max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-20">
      Professional Standards & Trust
    </h2>

    <div className="grid md:grid-cols-3 gap-12">

      {[
        "Ethical Independent Practice",
        "Secure & Compliant Data Handling",
        "Globally Licensed Medical Network",
      ].map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-12 rounded-3xl shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

          <div className="relative">
            <Award className="mx-auto text-[var(--color-primary)] mb-6" size={32} />
            <p className="font-semibold text-lg">{item}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


    </div>
  );
}