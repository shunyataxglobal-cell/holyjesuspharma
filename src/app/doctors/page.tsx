"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        setDoctors(data.doctors || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-beige)] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Our Specialists</h1>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
          World-class healthcare from experienced, dedicated professionals.
        </p>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-500 text-lg">No doctors found. Check back later.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
            {doctors.map((doc: any) => (
              <div key={doc._id} className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition duration-300">
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  <Image 
                    src={doc.image} 
                    alt={doc.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition duration-500" 
                    unoptimized
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-1">{doc.name}</h3>
                  <p className="text-[var(--color-primary)] font-medium mb-4">{doc.designation}</p>
                  
                  <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-gray-700">
                    <p><span className="font-semibold text-gray-900">Hospital:</span> {doc.hospital}</p>
                    {doc.education && doc.education.length > 0 && (
                      <p><span className="font-semibold text-gray-900">Education:</span> {doc.education.join(', ')}</p>
                    )}
                    {doc.experience && doc.experience.length > 0 && (
                      <p><span className="font-semibold text-gray-900">Experience:</span> {doc.experience[0]}</p>
                    )}
                  </div>
                  
                  <a href="/consultation" className="block text-center w-full py-3 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition font-semibold cursor-pointer">
                    Book Consultation
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}