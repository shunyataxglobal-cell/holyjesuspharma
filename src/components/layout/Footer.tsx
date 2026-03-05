"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition duration-300"
      >
        <Image
          src="/images/whatsapp.png"
          alt="WhatsApp"
          width={28}
          height={28}
        />
      </a>

      <footer className="relative bg-[#111111] text-white pt-32 pb-10 overflow-hidden">

        {/* Animated Wave Top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-[80px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39 56.44C240.73 65.84 160.07 75.24 79.41 75.24 39.7 75.24 0 70.44 0 70.44V0h1200v27.35c-80.66 9.4-161.32 18.8-241.98 18.8-80.66 0-161.32-9.4-241.98-18.8-80.66-9.4-161.32-18.8-241.98-18.8-80.66 0-161.32 9.4-241.98 18.8-80.66 9.4-161.32 18.8-241.98 18.8z"
              fill="#ffffff"
              opacity="0.1"
            ></path>
          </svg>
        </div>

        {/* Glow */}
        <div className="absolute -top-20 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6">

          {/* Main Grid */}
          <div className="grid md:grid-cols-4 gap-14 mb-16">

            {/* Logo */}
            <div>
              <Image
                src="/footer/logo.png"
                alt="Holy Jesus Pharma"
                width={100}
                height={20}
                className="mb-6"
              />
              <p className="text-gray-400 leading-relaxed">
                Secure online consultations and medicine delivery with certified doctors worldwide.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 p-3 rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer"
                  >
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/consultation">Consultation</Link></li>
                <li><Link href="/Conditions">Conditions</Link></li>
                <li><Link href="/Networks">Networks</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Video Consultation</li>
                <li>Voice Consultation</li>
                <li>Chat Consultation</li>
                <li>Medicine Delivery</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone size={18} />
                  <span>+1 234 567 890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} />
                  <span>holyjesuspharmarx@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} />
                  <span>Global Online Service</span>
                </div>
              </div>
            </div>

          </div>


        </div>
      </footer>
    </>
  );
}