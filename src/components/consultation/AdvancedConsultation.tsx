"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, Users, Star } from "lucide-react";
import Image from "next/image";

const steps = [
  "Personal Information",
  "Medical History",
  "Appointment Details",
  "Review & Submit",
];

const doctors = [
  {
    name: "Dr. John Smith",
    specialty: "Cardiologist",
    image: "/images/services/video.jpg",
  },
  {
    name: "Dr. Emily Johnson",
    specialty: "Dermatologist",
    image: "/images/services/voice.jpg",
  },
  {
    name: "Dr. Michael Brown",
    specialty: "General Physician",
    image: "/images/services/chat.jpg",
  },
];

export default function AdvancedConsultation() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-white">

      {/* ================= PREMIUM HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero/hero.png')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-16 rounded-3xl border border-white/20 shadow-2xl max-w-4xl">
         
          <span className="block mt-3 text-white text-7xl" >
            Online Doctor 
          </span>

          <span className="block mt-4 text-[var(--color-primary)] font-semibold text-8xl">
            Consultation
          </span>


          <p className="mt-8 text-xl text-white/80">
            Secure, confidential and personalized healthcare from certified specialists.
          </p>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
          {[ShieldCheck, Clock, Users].map((Icon, i) => (
            <div
              key={i}
              className="bg-[var(--color-beige)] p-10 rounded-3xl shadow-lg hover:shadow-2xl transition"
            >
              <Icon className="mx-auto text-[var(--color-primary)]" size={40} />
              <p className="mt-6 text-lg font-semibold">
                {i === 0 && "100% Secure Platform"}
                {i === 1 && "Quick Response Time"}
                {i === 2 && "Certified Doctors"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOCTORS ================= */}
      <section className="py-25 bg-gradient-to-b from-white to-[var(--color-beige)]">
        <div className="max-w-7xl mx-auto px-10">
        
          <span className="block mt-3 text-6xl text-center">
             Meet Our
          </span>

          <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl text-center pb-20">
             Specialists
          </span>

          <div className="grid md:grid-cols-3 gap-12">
            {doctors.map((doc, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -12 }}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden transition duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-semibold">{doc.name}</h3>
                  <p className="text-gray-600">{doc.specialty}</p>

                  <div className="flex mt-4 text-[var(--color-primary)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <button className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer">
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


{/* ================= CONSULTATION PROCESS ================= */}
<section className="py-36 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <span className="block mt-3 text-8xl text-center">
            How Your
          </span>

          <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl text-center">
              Consultation Works
          </span>

    

    <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-20">
      Simple, secure and fast process designed to provide you the best medical support.
    </p>

    <div className="grid md:grid-cols-4 gap-10">

      {[
        { step: "01", title: "Fill The Form", desc: "Provide your medical details securely." },
        { step: "02", title: "Doctor Review", desc: "Our specialist reviews your case carefully." },
        { step: "03", title: "Consultation", desc: "Connect via video, voice or chat." },
        { step: "04", title: "Prescription & Delivery", desc: "Get approved medicines delivered safely." },
      ].map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -8 }}
          className="bg-[var(--color-beige)] p-10 rounded-3xl shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-[var(--color-primary)] mb-6">
            {item.step}
          </div>
          <h4 className="text-xl font-semibold mb-4">{item.title}</h4>
          <p className="text-gray-600">{item.desc}</p>
        </motion.div>
      ))}

    </div>
  </div>
</section>


      {/* ================= FORM SECTION ================= */}
      <section className="relative py-20 bg-[var(--color-beige)] overflow-hidden">

        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight mb-8 pl-150">
            Consultation
            <span className="block text-[var(--color-primary)] mt-2 pl-20">
              Form
            </span>
          </h2>


        {/* Background Glow */}
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>
        

        <div className="relative max-w-[1100px] mx-auto px-6">

          <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-16">

            {/* Step Indicator */}
           {/* ===== Advanced Step Progress ===== */}
<div className="relative mb-16">

  {/* Progress Line */}
  <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200"></div>
  <div
    className="absolute top-5 left-0 h-[2px] bg-[var(--color-primary)] transition-all duration-500"
    style={{
      width: `${(currentStep / (steps.length - 1)) * 100}%`,
    }}
  ></div>

  <div className="flex justify-between relative">

    {steps.map((step, index) => {
      const active = index === currentStep;
      const completed = index < currentStep;

      return (
        <div key={index} className="text-center flex-1">

          {/* Circle */}
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
              ${
                active
                  ? "bg-[var(--color-primary)] text-white scale-110"
                  : completed
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {index + 1}
          </div>

          {/* Step Name */}
          <p
            className={`mt-3 text-sm transition-all duration-300
              ${
                active
                  ? "text-[var(--color-dark)] font-semibold"
                  : "text-gray-500"
              }`}
          >
            {step}
          </p>

        </div>
      );
    })}

  </div>
</div>


<form>
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >

    {/* ================= STEP 1 – PERSONAL INFORMATION ================= */}
    {currentStep === 0 && (
      <div className="space-y-6">

        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" required placeholder="Full Name"
            className="form-input" />
          <input type="email" required placeholder="Email Address"
            className="form-input" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <input type="tel" required placeholder="Phone Number"
            className="form-input" />
          <input type="date" required className="form-input" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <select required className="form-input">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input type="number" required placeholder="Age"
            className="form-input" />
        </div>

        <input type="text" required placeholder="Full Address"
          className="form-input" />

      </div>
    )}

    {/* ================= STEP 2 – MEDICAL HISTORY ================= */}
    {currentStep === 1 && (
      <div className="space-y-6">

        <textarea required rows={4}
          placeholder="Describe your current symptoms"
          className="form-input rounded-3xl"
        />

        <textarea required rows={3}
          placeholder="Current medications (if any)"
          className="form-input rounded-3xl"
        />

        <textarea required rows={3}
          placeholder="Known allergies"
          className="form-input rounded-3xl"
        />

        <select required className="form-input">
          <option value="">Do you have any chronic condition?</option>
          <option>Diabetes</option>
          <option>Hypertension</option>
          <option>Heart Disease</option>
          <option>Asthma</option>
          <option>None</option>
        </select>

        <input type="file" required
          className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-primary)] file:text-white"
        />

      </div>
    )}

    {/* ================= STEP 3 – APPOINTMENT ================= */}
    {currentStep === 2 && (
      <div className="space-y-6">

        <div className="grid md:grid-cols-2 gap-6">
          <input type="date" required className="form-input" />
          <input type="time" required className="form-input" />
        </div>

        <select required className="form-input">
          <option value="">Select Consultation Type</option>
          <option>Video Consultation</option>
          <option>Voice Consultation</option>
          <option>Chat Consultation</option>
        </select>

        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" required placeholder="Emergency Contact Name"
            className="form-input" />
          <input type="tel" required placeholder="Emergency Contact Number"
            className="form-input" />
        </div>

      </div>
    )}

    {/* ================= STEP 4 – CONSENT ================= */}
    {currentStep === 3 && (
      <div className="space-y-8">

        <div className="flex items-start gap-3">
          <input type="checkbox" required className="mt-2" />
          <p className="text-gray-600">
            I confirm that the information provided is accurate and agree to the consultation terms.
          </p>
        </div>

        <button type="submit"
          className="w-full bg-black text-white py-4 rounded-full hover:bg-[var(--color-primary)] transition text-lg cursor-pointer">
          Submit Consultation Request
        </button>

      </div>
    )}

    {/* Navigation */}
    <div className="flex justify-between mt-12">
      {currentStep > 0 && (
        <button type="button"
          onClick={prevStep}
          className="px-6 py-2 border rounded-full cursor-pointer">
          Back
        </button>
      )}

      {currentStep < steps.length - 1 && (
        <button type="button"
          onClick={nextStep}
          className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-full cursor-pointer">
          Next
        </button>
      )}
    </div>

  </motion.div>
</form>

          </div>
        </div>
      </section>

    </div>
  );
}