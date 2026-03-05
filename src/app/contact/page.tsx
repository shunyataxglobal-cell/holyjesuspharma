"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Message Sent Successfully ✅");
  };

  return (
    <div className="bg-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative py-32 bg-gradient-to-br from-[var(--color-beige)] to-white text-center overflow-hidden">

        {/* Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Let’s Talk About
            <span className="block text-[var(--color-primary)]">
              Your Health
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Reach out to our team for consultations, support, or partnerships.
          </p>
        </div>
      </section>

      {/* ================= SPLIT SECTION ================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT SIDE - INFO */}
          <div className="space-y-10">

            <h2 className="text-3xl font-bold">
              Contact Information
            </h2>

            {[
              { icon: Phone, title: "Phone", desc: "+91 98765 43210" },
              { icon: Mail, title: "Email", desc: "holyjesuspharmarx@gmail.com" },
              { icon: MapPin, title: "Location", desc: "Mumbai, India" },
              { icon: Clock, title: "Available", desc: "24/7 Support" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-5 p-6 bg-[var(--color-beige)] rounded-3xl shadow-md"
                >
                  <div className="p-4 bg-[var(--color-primary)] text-white rounded-full">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* RIGHT SIDE - FORM */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="form-input"
                />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone Number"
                onChange={handleChange}
                className="form-input"
              />

              <input
                type="text"
                name="subject"
                required
                placeholder="Subject"
                onChange={handleChange}
                className="form-input"
              />

              <textarea
                name="message"
                rows={5}
                required
                placeholder="Your Message"
                onChange={handleChange}
                className="form-input rounded-3xl"
              ></textarea>

              <button
                type="submit"
                className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition text-lg shadow-lg cursor-pointer"
              >
                Send Message
              </button>

            </form>
          </motion.div>

        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="py-24 bg-[var(--color-beige)] text-center">
        <h2 className="text-3xl font-bold mb-10">
          Visit Our Location
        </h2>

        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!..."
              className="w-full h-[400px]"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      

      {/* ================= INPUT STYLES ================= */}
      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 16px 24px;
          border-radius: 999px;
          border: 1px solid #ddd;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
      `}</style>

    </div>
  );
}