"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ConsultationForm({ onClose }: any) {

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Personal Info",
    "Medical History",
    "Appointment",
    "Consent"
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // future API logic
    onClose();
  };

  return (
    <section className="relative py-10 bg-[var(--color-beige)]">

      <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight mb-8 pl-[150px]">
        Consultation
        <span className="block text-[var(--color-primary)] mt-2 pl-[20px]">
          Form
        </span>
      </h2>

      {/* Background Glow */}
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-[1100px] mx-auto px-6">

        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-16">

          {/* Progress */}
          <div className="relative mb-16">

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

          <form onSubmit={handleSubmit}>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >

              {/* STEP 1 */}
              {currentStep === 0 && (
                <div className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" required placeholder="Full Name" className="form-input"/>
                    <input type="email" required placeholder="Email Address" className="form-input"/>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="tel" required placeholder="Phone Number" className="form-input"/>
                    <input type="date" required className="form-input"/>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <select required className="form-input">
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>

                    <input type="number" required placeholder="Age" className="form-input"/>
                  </div>

                  <input type="text" required placeholder="Full Address" className="form-input"/>

                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 1 && (
                <div className="space-y-6">

                  <textarea required rows={4} placeholder="Describe your current symptoms" className="form-input rounded-3xl"/>

                  <textarea required rows={3} placeholder="Current medications (if any)" className="form-input rounded-3xl"/>

                  <textarea required rows={3} placeholder="Known allergies" className="form-input rounded-3xl"/>

                  <select required className="form-input">
                    <option value="">Do you have any chronic condition?</option>
                    <option>Diabetes</option>
                    <option>Hypertension</option>
                    <option>Heart Disease</option>
                    <option>Asthma</option>
                    <option>None</option>
                  </select>

                  <input type="file"
                    className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-primary)] file:text-white"
                  />

                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 2 && (
                <div className="space-y-6">

                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="date" required className="form-input"/>
                    <input type="time" required className="form-input"/>
                  </div>

                  <select required className="form-input">
                    <option value="">Select Consultation Type</option>
                    <option>Video Consultation</option>
                    <option>Voice Consultation</option>
                    <option>Chat Consultation</option>
                  </select>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" required placeholder="Emergency Contact Name" className="form-input"/>
                    <input type="tel" required placeholder="Emergency Contact Number" className="form-input"/>
                  </div>

                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 3 && (
                <div className="space-y-8">

                  <div className="flex items-start gap-3">
                    <input type="checkbox" required className="mt-2"/>
                    <p className="text-gray-600">
                      I confirm that the information provided is accurate and agree to the consultation terms.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-full hover:bg-[var(--color-primary)] transition text-lg"
                  >
                    Submit Consultation Request
                  </button>

                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-12">

                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border rounded-full"
                  >
                    Back
                  </button>
                )}

                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-full"
                  >
                    Next
                  </button>
                )}

              </div>

            </motion.div>

          </form>

        </div>
      </div>

    </section>
  );
}