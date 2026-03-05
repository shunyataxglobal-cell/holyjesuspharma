"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const conditions = [
  {
    title: "Erectile Dysfunction",
    image: "/images/conditions/image-1.png",
    desc: "Erectile Dysfunction (ED) is a common condition that affects a man’s ability to achieve or maintain an erection suitable for sexual activity. While occasional difficulty is normal, frequent or ongoing issues may indicate an underlying health condition that requires medical attention  ED can be caused by physical factors such as diabetes, high blood pressure, heart disease, hormonal imbalance, or lifestyle habits like smoking and stress. Emotional factors such as anxiety, depression, and relationship concerns may also contribute.",
  },
  {
    title: "Weight Loss & Metabolic Health",
    image: "/images/conditions/image-2.png",
    desc: "Achieving and maintaining a healthy weight is essential for overall well-being and long-term health. Our Weight Loss & Metabolic Health program focuses on safe, medically guided solutions tailored to your body type, lifestyle, and health goals.Metabolic health plays a crucial role in weight management. Conditions such as insulin resistance, thyroid imbalance, hormonal disorders, and slow metabolism can make weight loss challenging without proper medical guidance.",
  },
  {
    title: "Diabetes Care",
    image: "/images/conditions/image-3.png",
    desc: "Achieving and maintaining a healthy weight is essential for overall well-being and long-term health. Our Weight Loss & Metabolic Health program focuses on safe, medically guided solutions tailored to your body type, lifestyle, and health goals. Metabolic health plays a crucial role in weight management. Conditions such as insulin resistance, thyroid imbalance, hormonal disorders, and slow metabolism can make weight loss challenging without proper medical guidance.",
  },
  {
    title: "HIV Care",
    image: "/images/conditions/image-4.png",
    desc: "Living with HIV requires continuous medical support, proper treatment, and compassionate care. Our HIV Care services are designed to provide confidential consultations, expert medical guidance, and ongoing treatment management to help you live a healthy and fulfilling life. With advancements in modern medicine, HIV is a manageable condition when treated consistently with Antiretroviral Therapy (ART). Early diagnosis and regular monitoring are key to maintaining a strong immune system and preventing complications.",
  },
];

export default function ConditionsPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">

        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Conditions <br />
              <span className="text-[var(--color-primary)]">
                We Treat
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-600 max-w-lg">
              Get expert consultation for a wide range of medical conditions.
              Secure, private, and professional healthcare from licensed doctors.
            </p>

            <Link href="/consultation">
              <button className="mt-10 px-8 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer">
                Start Consultation
              </button>
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/hero/hero.png"
              alt="Medical Care"
              fill
              className="object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* ================= FLOATING CATEGORY PILLS ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-6">
          {conditions.map((item, index) => (
            <motion.span
              whileHover={{ scale: 1.1 }}
              key={index}
              className="px-6 py-3 bg-[var(--color-beige)] rounded-full text-sm font-medium shadow hover:shadow-lg transition cursor-pointer"
            >
              {item.title}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ================= PREMIUM CARDS GRID ================= */}
      {/* ================= CONDITIONS SPLIT SECTIONS ================= */}
{conditions.map((item, index) => (
  <section
    key={index}
    className={`py-32 ${
      index % 2 === 0 ? "bg-white" : "bg-[var(--color-beige)]"
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

      {/* TEXT SIDE */}
      <div className={`${index % 2 !== 0 ? "md:order-2" : ""}`}>

        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          {item.title}
        </h2>

        <p className="mt-8 text-lg text-gray-600 max-w-xl">
          {item.desc}
        </p>

        <ul className="mt-8 space-y-3 text-gray-700">
          <li>✔ Expert licensed specialists</li>
          <li>✔ Personalized treatment plans</li>
          <li>✔ Confidential & secure process</li>
        </ul>

      </div>

      {/* IMAGE SIDE */}
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`relative h-[450px] rounded-3xl overflow-hidden shadow-2xl ${
          index % 2 !== 0 ? "md:order-1" : ""
        }`}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover hover:scale-105 transition duration-700"
        />
      </motion.div>

    </div>
  </section>
))}

      {/* ================= PREMIUM TRUST SECTION ================= */}
<section className="relative py-32 bg-gradient-to-br from-white to-[var(--color-beige)] overflow-hidden">

  {/* Background Glow */}
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

  <div className="relative max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-4xl md:text-5xl font-bold mb-20">
      Why Patients Trust Us
    </h2>

    <div className="grid md:grid-cols-3 gap-10">

      {[
        {
          title: "Licensed & Experienced Doctors",
          desc: "All consultations are handled by certified and verified specialists."
        },
        {
          title: "Fully Confidential Consultations",
          desc: "Your medical information remains private and secure."
        },
        {
          title: "Fast Prescription & Delivery",
          desc: "Quick approval process with safe medicine delivery."
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="group bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/40 hover:shadow-2xl transition"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-full text-xl font-bold group-hover:scale-110 transition">
            {`0${i + 1}`}
          </div>

          <h4 className="text-lg font-semibold mb-4">
            {item.title}
          </h4>

          <p className="text-gray-600 text-sm">
            {item.desc}
          </p>
        </motion.div>
      ))}

    </div>

  </div>
</section>

      {/* ================= PREMIUM CTA SECTION ================= */}
<section className="relative py-28 overflow-hidden">

  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-black to-[var(--color-primary)]"></div>

  {/* Glow Effect */}
  <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-3xl"></div>

  <div className="relative max-w-5xl mx-auto px-6 text-center text-white">

    <h2 className="text-4xl md:text-5xl font-bold mb-6">
      Ready to Take Control of Your Health?
    </h2>

    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
      Book your secure consultation today and get expert medical guidance from licensed professionals.
    </p>

    <Link href="/consultation">
      <button className="px-10 py-4 bg-white text-black rounded-full font-semibold hover:bg-[var(--color-beige)] transition shadow-xl cursor-pointer">
        Book Consultation Now
      </button>
    </Link>

  </div>

</section>
    </div>
  );
}