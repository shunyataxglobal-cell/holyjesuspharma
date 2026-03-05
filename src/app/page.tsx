"use client";

import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import PersonalizedSection from "@/components/home/PersonalizedSection";
import { useState } from "react";
import ConsultationModal from "@/components/consultation/ConsultationModal";

export default function Home() {
    const [open, setOpen] = useState(false);
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <PersonalizedSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
        <ConsultationModal open={open} setOpen={setOpen} />
      
    </>
  );
}