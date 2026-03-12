"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doctors } from "@/data/doctors";


export default function NetworkPage() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="relative py-28 bg-gradient-to-br from-[var(--color-beige)] to-white text-center overflow-hidden">
        <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Our Trusted
            <span className="block text-[var(--color-primary)]">
              Medical Network
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Meet our highly experienced specialists providing secure and world-class healthcare services.
          </p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Certified Doctors" },
            { number: "30+", label: "Specializations" },
            { number: "50K+", label: "Patients Served" },
            { number: "25+", label: "Years Experience" },
          ].map((item, i) => (
            <div key={i} className="bg-[var(--color-beige)] p-8 rounded-3xl shadow-lg">
              <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                {item.number}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOCTOR CARDS ================= */}
      {session ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

          {doctors.map((doctor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >

            {/* TOP SECTION */}
            <div className="grid md:grid-cols-3">

              {/* IMAGE */}
              <div className="relative h-[400px] ">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* HEADER INFO */}
              <div className="md:col-span-2 bg-gradient-to-r from-[var(--color-primary)] to-teal-500 text-white p-10 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {doctor.name}
                </h2>
                <p className="mt-3 text-sm md:text-base opacity-90">
                  {doctor.designation}
                </p>
                <p className="mt-2 font-medium">
                  {doctor.hospital}
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-2 gap-12 p-10">

              <div>
                <h3 className="inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Education & Training
                </h3>
                <ul className="mt-6 space-y-3 text-gray-700">
                  {doctor.education.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>

                <h3 className="inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mt-10">
                  Experience
                </h3>
                <ul className="mt-6 space-y-3 text-gray-700">
                  {doctor.experience.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Areas of Interest
                </h3>
                <ul className="mt-6 space-y-3 text-gray-700">
                  {doctor.interests.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>

                <Link href="/consultation">
                  <button className="mt-10 px-8 py-3 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer">
                    Book Consultation
                  </button>
                </Link>
              </div>

            </div>

          </motion.div>
          ))}

        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200"
          >
            <h2 className="text-3xl font-bold mb-4">Medical Network</h2>
            <p className="text-xl text-gray-600 mb-8">Please login to view our medical network and specialist doctors</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent("/networks")}`)}
              className="px-10 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition font-semibold cursor-pointer shadow-lg"
            >
              Please Login
            </motion.button>
          </motion.div>
        </div>
      )}


      {/* ================= FINAL CTA ================= */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-[var(--color-primary)]"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Are You a Licensed Medical Professional?
          </h2>
          <p className="text-white/80 mb-10 max-w-2xl mx-auto">
            Join our growing global medical network and expand your professional reach.
          </p>
          <Link href="/contact">
            <button className="px-10 py-4 bg-white text-black rounded-full font-semibold hover:bg-[var(--color-beige)] transition cursor-pointer">
              Join Our Network
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}