"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const services = [
  {
    title: "Video Call Consultation",
    description:
      "VIDEO CALL CONSULTATIONS Experience face-to-face medical care from the comfort of your home with our secure Video Call Consultation service. Speak directly with certified doctors, discuss your symptoms in detail, and receive expert medical advice — all in real time. Our video consultations allow doctors to better understand your condition through visual assessment, making it ideal for accurate diagnosis and personalized treatment recommendations.",
    image: "/images/services/video.png",

    details: (
      <>
        <h3 className="text-3xl font-bold mb-4">
          VIDEO CALL CONSULTATIONS
        </h3>

        <p className="text-gray-600 leading-relaxed mb-6">
          VIDEO CALL CONSULTATIONS Experience face-to-face medical care from the comfort of your home with our secure Video Call Consultation service. Speak directly with certified doctors, discuss your symptoms in detail, and receive expert medical advice — all in real time. Our video consultations allow doctors to better understand your condition through visual assessment, making it ideal for accurate diagnosis and personalized treatment recommendations.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          🎥 Why Choose Video Consultation?
        </h4>

        <ul className="space-y-2 text-gray-600">
          <li>✔️ Real-time face-to-face interaction</li>
          <li>✔️ Better visual assessment of symptoms</li>
          <li>✔️ Easy prescription & follow-up care</li>
          <li>✔️ Safe, secure & confidential platform</li>
          <li>✔️ No travel, no waiting rooms</li>
        </ul>
      </>
    ),
  },

  {
    title: "Voice Call Consultation",
    description:
      "Get expert medical advice quickly and conveniently through our Voice Call Consultation service. Speak directly with a qualified doctor over the phone and discuss your health concerns in a comfortable, private setting — without the need for video. Voice consultations are perfect for patients who prefer simple communication while still receiving accurate diagnosis, treatment guidance, and prescriptions when required.",
    image: "/images/services/voice.png",

    details: (
      <>
        <h3 className="text-3xl font-bold mb-4">
          VOICE CALL CONSULTATIONS
        </h3>

        <p className="text-gray-600 leading-relaxed mb-6">
         Get expert medical advice quickly and conveniently through our Voice Call Consultation service. Speak directly with a qualified doctor over the phone and discuss your health concerns in a comfortable, private setting — without the need for video. Voice consultations are perfect for patients who prefer simple communication while still receiving accurate diagnosis, treatment guidance, and prescriptions when required.
        </p>

        <h4 className="text-lg font-semibold mb-3">
         📞 Why Choose Voice Consultation?
        </h4>

        <ul className="space-y-2 text-gray-600">
          <li>✔️ Quick and easy access to doctors</li>
          <li>✔️ No internet video requirement</li>
          <li>✔️ Secure and confidential conversation</li>
          <li>✔️ Ideal for follow-ups and medication guidance</li>
          <li>✔️ Saves travel time and waiting hours</li>
        </ul>
      </>
    ),
  },

  {
    title: "Chat Consultation",
    description:
      "Connect with certified doctors through our secure Chat Consultation service and receive medical advice anytime, anywhere. Simply type your symptoms, upload reports if needed, and get expert guidance without scheduling a call. Chat consultations are convenient, private, and ideal for patients who prefer written communication. You can revisit the conversation anytime for clarity on prescriptions or medical instructions.Connect with certified doctors through our secure Chat Consultation service and receive medical advice anytime.",
    image: "/images/services/chat.png",

    details: (
      <>
        <h3 className="text-3xl font-bold mb-4">
          CHAT CONSULTATIONS
        </h3>

        <p className="text-gray-600 leading-relaxed mb-6">
         Connect with certified doctors through our secure Chat Consultation service and receive medical advice anytime, anywhere. Simply type your symptoms, upload reports if needed, and get expert guidance without scheduling a call. Chat consultations are convenient, private, and ideal for patients who prefer written communication. You can revisit the conversation anytime for clarity on prescriptions or medical instructions.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          💬 Why Choose Chat Consultation?
        </h4>

        <ul className="space-y-2 text-gray-600">
          <li>✔️ Instant messaging with qualified doctors</li>
          <li>✔️ Share reports, images, and prescriptions easily</li>
          <li>✔️ Secure and confidential platform</li>
          <li>✔️ No waiting rooms or travel required</li>
          <li>✔️ Access chat history anytime</li>
        </ul>
      </>
    ),
  },
];

export default function ServicesSection() {

  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <section className="relative py-20 bg-[var(--color-beige)] overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">

          <span className="block mt-3 text-8xl">
            Our
          </span>

          <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl">
            Consultation Services
          </span>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the way you want to connect with our certified doctors.
          </p>

        </div>

        <div className="space-y-36">

          {services.map((service, index) => {

            const isEven = index % 2 === 0;

            return (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-20 items-center relative"
              >

                <div className="absolute -z-10 text-[150px] font-bold text-black/5 select-none">
                  0{index + 1}
                </div>

                {/* IMAGE */}
                <div
                  className={`relative h-[450px] rounded-3xl overflow-hidden shadow-2xl group ${
                    isEven ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* TEXT */}
                <div className={`${isEven ? "md:order-1" : "md:order-2"}`}>

                  <h3 className="text-5xl font-semibold text-[var(--color-dark)] mb-6">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedService(service)}
                    className="bg-black text-white px-8 py-4 rounded-full shadow-xl hover:bg-[var(--color-primary)] transition duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    Learn More
                    <ArrowRight size={18} />
                  </motion.button>

                </div>

              </motion.div>

            );
          })}

        </div>

      </div>


      {/* POPUP */}

      <AnimatePresence>

        {selectedService && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          >

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[var(--color-beige)] rounded-3xl max-w-2xl w-full p-10 relative shadow-2xl max-h-[80vh] overflow-y-auto"
            >

              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 text-2xl"
              >
                ✕
              </button>

              {selectedService.details}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
}