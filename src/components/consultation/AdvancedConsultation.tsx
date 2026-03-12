"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Script from "next/script";

const steps = [
  "Personal Information",
  "Medical History",
  "Select Doctor & Appointment",
  "Review & Payment",
];

export default function AdvancedConsultation() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [error, setError] = useState("");
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    age: "",
    address: "",
    symptoms: "",
    medications: "",
    allergies: "",
    chronicCondition: "",
    medicalReportUrl: "",
    consultationDate: "",
    consultationTime: "",
    consultationType: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if(data.doctors) {
          setAllDoctors(data.doctors);
          setDoctors(data.doctors.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ""))) return "Phone must be 10 digits";
        break;
      case "dateOfBirth":
        if (!value) return "Date of birth is required";
        break;
      case "gender":
        if (!value) return "Gender is required";
        break;
      case "age":
        if (!value) return "Age is required";
        if (parseInt(value) < 1 || parseInt(value) > 120) return "Age must be between 1 and 120";
        break;
      case "address":
        if (!value.trim()) return "Address is required";
        break;
      case "symptoms":
        if (!value.trim()) return "Symptoms description is required";
        break;
      case "medications":
        if (!value.trim()) return "Please specify medications (or 'None')";
        break;
      case "allergies":
        if (!value.trim()) return "Please specify allergies (or 'None')";
        break;
      case "chronicCondition":
        if (!value) return "Please select a chronic condition option";
        break;
      case "consultationDate":
        if (!value) return "Consultation date is required";
        break;
      case "consultationTime":
        if (!value) return "Consultation time is required";
        break;
      case "consultationType":
        if (!value) return "Consultation type is required";
        break;
      case "emergencyContactName":
        if (!value.trim()) return "Emergency contact name is required";
        break;
      case "emergencyContactNumber":
        if (!value.trim()) return "Emergency contact number is required";
        if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ""))) return "Phone must be 10 digits";
        break;
    }
    return "";
  };

  const nextStep = () => {
    const errors: Record<string, string> = {};
    let hasError = false;

    if (currentStep === 0) {
      ["fullName", "email", "phone", "dateOfBirth", "gender", "age", "address"].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          errors[field] = error;
          hasError = true;
        }
      });
    } else if (currentStep === 1) {
      ["symptoms", "medications", "allergies", "chronicCondition"].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          errors[field] = error;
          hasError = true;
        }
      });
    } else if (currentStep === 2) {
      if (!selectedDoctorForBooking) {
        setError("Please select a doctor");
        return;
      }
      ["consultationDate", "consultationTime", "consultationType", "emergencyContactName", "emergencyContactNumber"].forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          errors[field] = error;
          hasError = true;
        }
      });
    }

    if (hasError) {
      setFieldErrors(errors);
      setError("Please fix the errors above");
      return;
    }

    setFieldErrors({});
    setError("");
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/consultation")}`);
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, age: Number(formData.age), consultationFee: 500 }),
      });
      const data = await res.json();
      if (res.ok) {
        setConsultationId(data.consultation._id);
        await initiatePayment(data.consultation._id);
      } else {
        setError(data.error || "Failed to book consultation");
        toast.error(data.error || "Failed to book consultation");
      }
    } catch (e) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const initiatePayment = async (consultId: string) => {
    if (!selectedDoctorForBooking) {
      toast.error("Please select a doctor");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await fetch("/api/consultations/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: consultId,
          selectedDoctorId: selectedDoctorForBooking._id,
        }),
      });
      const data = await res.json();
      
      if (res.ok && razorpayLoaded) {
        const options = {
          key: data.keyId,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: "Holy Jesus PharmaRX",
          description: "Doctor Consultation",
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/consultations/payment", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                consultationId: consultId,
              }),
            });
            const vData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.success("Payment successful! Consultation booked. Doctor will contact you soon.");
              router.push("/dashboard");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#E6A57E",
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function (response: any) {
          toast.error("Payment Failed: " + response.error.description);
        });
      } else {
        toast.error("Razorpay is loading. Please wait...");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    }
    setPaymentLoading(false);
  };

  return (
    <div className="bg-white">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error("Failed to load payment gateway")}
      />

      {/* ================= PREMIUM HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero/hero.png')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-16 rounded-3xl border border-white/20 shadow-2xl max-w-4xl">
          <span className="block mt-3 text-white text-7xl" >Online Doctor</span>
          <span className="block mt-4 text-[var(--color-primary)] font-semibold text-8xl">Consultation</span>
          <p className="mt-8 text-xl text-white/80">Secure, confidential and personalized healthcare from certified specialists.</p>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
          {[ShieldCheck, Clock, Users].map((Icon, i) => (
            <div key={i} className="bg-[var(--color-beige)] p-10 rounded-3xl shadow-lg hover:shadow-2xl transition">
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
      {session ? (
        <section className="py-25 bg-gradient-to-b from-white to-[var(--color-beige)]">
          <div className="max-w-7xl mx-auto px-10">
            <span className="block mt-3 text-6xl text-center">Meet Our</span>
            <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl text-center pb-20">Specialists</span>
            <div className="grid md:grid-cols-3 gap-12">
              {doctors.length > 0 ? doctors.map((doc, index) => (
                <motion.div key={index} whileHover={{ y: -12 }} className="group bg-white rounded-3xl shadow-xl overflow-hidden transition duration-300">
                  <div className="relative h-80 overflow-hidden">
                    <Image src={doc.image} alt={doc.name} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold">{doc.name}</h3>
                    <p className="text-gray-600">{doc.designation}</p>
                    <div className="flex mt-4 text-[var(--color-primary)]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              )) : <div className="col-span-3 text-center text-gray-500">Loading top doctors...</div>}
            </div>
          </div>

        {/* Doctor Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
               <button onClick={() => setSelectedDoctor(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold text-xl">✕</button>
               
               <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-gray-100 shrink-0">
                     <Image src={selectedDoctor.image} alt={selectedDoctor.name} fill className="object-cover" />
                  </div>
                  <div className="text-center md:text-left">
                     <h2 className="text-3xl font-bold">{selectedDoctor.name}</h2>
                     <p className="text-[var(--color-primary)] font-semibold text-lg">{selectedDoctor.designation}</p>
                     <p className="text-gray-500 mt-1">{selectedDoctor.hospital}</p>
                     <div className="flex justify-center md:justify-start mt-3 text-[var(--color-primary)]">
                       {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                 {selectedDoctor.education && selectedDoctor.education.length > 0 && (
                   <div>
                     <h4 className="font-bold text-lg mb-2 border-b pb-2">Education</h4>
                     <ul className="list-disc pl-5 text-gray-600 space-y-1">
                       {selectedDoctor.education.map((item: string, i: number) => <li key={i}>{item}</li>)}
                     </ul>
                   </div>
                 )}
                 {selectedDoctor.experience && selectedDoctor.experience.length > 0 && (
                   <div>
                     <h4 className="font-bold text-lg mb-2 border-b pb-2">Experience</h4>
                     <ul className="list-disc pl-5 text-gray-600 space-y-1">
                       {selectedDoctor.experience.map((item: string, i: number) => <li key={i}>{item}</li>)}
                     </ul>
                   </div>
                 )}
                 {selectedDoctor.interests && selectedDoctor.interests.length > 0 && (
                   <div>
                     <h4 className="font-bold text-lg mb-2 border-b pb-2">Special Interests</h4>
                     <ul className="list-disc pl-5 text-gray-600 space-y-1">
                       {selectedDoctor.interests.map((item: string, i: number) => <li key={i}>{item}</li>)}
                     </ul>
                   </div>
                 )}
               </div>
               
               <div className="mt-8 text-center pt-6 border-t">
                 <button onClick={() => { setSelectedDoctor(null); window.scrollTo({ top: document.getElementById('consultation-form')?.offsetTop || 0, behavior: 'smooth' }); }} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition shadow-lg">
                   Book Consultation with {selectedDoctor.name.split(' ')[0]}
                 </button>
               </div>
            </div>
          </div>
        )}
        </section>
      ) : (
        <section className="py-25 bg-gradient-to-b from-white to-[var(--color-beige)]">
          <div className="max-w-4xl mx-auto px-10 text-center">
            <span className="block mt-3 text-6xl">Meet Our</span>
            <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl pb-12">Specialists</span>
            <p className="text-xl text-gray-600 mb-12">Login to view our specialist doctors and book consultations</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent("/consultation")}`)}
              className="px-12 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition text-lg font-semibold cursor-pointer shadow-lg"
            >
              Consult Now
            </motion.button>
          </div>
        </section>
      )}

      {/* ================= CONSULTATION PROCESS ================= */}
      <section className="py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="block mt-3 text-8xl text-center">How Your</span>
          <span className="block mt-2 text-[var(--color-primary)] font-semibold text-7xl text-center">Consultation Works</span>
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-20 mt-8">
            Simple, secure and fast process designed to provide you the best medical support.
          </p>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { step: "01", title: "Fill The Form", desc: "Provide your medical details securely." },
              { step: "02", title: "Doctor Review", desc: "Our specialist reviews your case carefully." },
              { step: "03", title: "Consultation", desc: "Connect via video, voice or chat." },
              { step: "04", title: "Prescription & Delivery", desc: "Get approved medicines delivered safely." },
            ].map((item, index) => (
              <motion.div key={index} whileHover={{ y: -8 }} className="bg-[var(--color-beige)] p-10 rounded-3xl shadow-lg text-center">
                <div className="text-3xl font-bold text-[var(--color-primary)] mb-6">{item.step}</div>
                <h4 className="text-xl font-semibold mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= FORM SECTION ================= */}
      {session ? (
        <section className="relative py-20 bg-[var(--color-beige)] overflow-hidden" id="consultation-form">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight">
              Consultation
              <span className="block text-[var(--color-primary)] mt-2">Form</span>
            </h2>
          </div>

        <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-[1100px] mx-auto px-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-16">
            
            <div className="relative mb-16">
              <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200"></div>
              <div className="absolute top-5 left-0 h-[2px] bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
              <div className="flex justify-between relative">
                {steps.map((step, index) => {
                  const active = index === currentStep;
                  const completed = index < currentStep;
                  return (
                    <div key={index} className="text-center flex-1">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${active ? "bg-[var(--color-primary)] text-white scale-110" : completed ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-600"}`}>
                        {index + 1}
                      </div>
                      <p className={`mt-3 text-sm transition-all duration-300 ${active ? "text-[var(--color-dark)] font-semibold" : "text-gray-500"}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <motion.div key={currentStep} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>

                {/* ================= STEP 1 – PERSONAL INFORMATION ================= */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className={`form-input ${fieldErrors.fullName ? "border-red-500" : ""}`} />
                        {fieldErrors.fullName && <p className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</p>}
                      </div>
                      <div>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className={`form-input ${fieldErrors.email ? "border-red-500" : ""}`} />
                        {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className={`form-input ${fieldErrors.phone ? "border-red-500" : ""}`} />
                        {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                      </div>
                      <div>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={`form-input ${fieldErrors.dateOfBirth ? "border-red-500" : ""}`} />
                        {fieldErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{fieldErrors.dateOfBirth}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <select name="gender" value={formData.gender} onChange={handleChange} required className={`form-input ${fieldErrors.gender ? "border-red-500" : ""}`}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {fieldErrors.gender && <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>}
                      </div>
                      <div>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="Age" className={`form-input ${fieldErrors.age ? "border-red-500" : ""}`} />
                        {fieldErrors.age && <p className="text-red-500 text-sm mt-1">{fieldErrors.age}</p>}
                      </div>
                    </div>
                    <div>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Full Address" className={`form-input ${fieldErrors.address ? "border-red-500" : ""}`} />
                      {fieldErrors.address && <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>}
                    </div>
                  </div>
                )}

                {/* ================= STEP 2 – MEDICAL HISTORY ================= */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} required rows={4} placeholder="Describe your current symptoms" className={`form-input rounded-3xl ${fieldErrors.symptoms ? "border-red-500" : ""}`} />
                      {fieldErrors.symptoms && <p className="text-red-500 text-sm mt-1">{fieldErrors.symptoms}</p>}
                    </div>
                    <div>
                      <textarea name="medications" value={formData.medications} onChange={handleChange} required rows={3} placeholder="Current medications (if any)" className={`form-input rounded-3xl ${fieldErrors.medications ? "border-red-500" : ""}`} />
                      {fieldErrors.medications && <p className="text-red-500 text-sm mt-1">{fieldErrors.medications}</p>}
                    </div>
                    <div>
                      <textarea name="allergies" value={formData.allergies} onChange={handleChange} required rows={3} placeholder="Known allergies" className={`form-input rounded-3xl ${fieldErrors.allergies ? "border-red-500" : ""}`} />
                      {fieldErrors.allergies && <p className="text-red-500 text-sm mt-1">{fieldErrors.allergies}</p>}
                    </div>
                    <div>
                      <select name="chronicCondition" value={formData.chronicCondition} onChange={handleChange} required className={`form-input ${fieldErrors.chronicCondition ? "border-red-500" : ""}`}>
                        <option value="">Do you have any chronic condition?</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Heart Disease">Heart Disease</option>
                        <option value="Asthma">Asthma</option>
                        <option value="None">None</option>
                      </select>
                      {fieldErrors.chronicCondition && <p className="text-red-500 text-sm mt-1">{fieldErrors.chronicCondition}</p>}
                    </div>
                  </div>
                )}

                {/* ================= STEP 3 – DOCTOR SELECTION & APPOINTMENT ================= */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3">Select Doctor *</label>
                      <div className="grid md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-2">
                        {allDoctors.map((doc) => (
                          <div
                            key={doc._id}
                            onClick={() => setSelectedDoctorForBooking(doc)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                              selectedDoctorForBooking?._id === doc._id
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 relative rounded-full overflow-hidden">
                                <Image src={doc.image} alt={doc.name} fill className="object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold">{doc.name}</p>
                                <p className="text-xs text-gray-600">{doc.designation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <input type="date" name="consultationDate" value={formData.consultationDate} onChange={handleChange} required className={`form-input ${fieldErrors.consultationDate ? "border-red-500" : ""}`} />
                        {fieldErrors.consultationDate && <p className="text-red-500 text-sm mt-1">{fieldErrors.consultationDate}</p>}
                      </div>
                      <div>
                        <input type="time" name="consultationTime" value={formData.consultationTime} onChange={handleChange} required className={`form-input ${fieldErrors.consultationTime ? "border-red-500" : ""}`} />
                        {fieldErrors.consultationTime && <p className="text-red-500 text-sm mt-1">{fieldErrors.consultationTime}</p>}
                      </div>
                    </div>
                    <div>
                      <select name="consultationType" value={formData.consultationType} onChange={handleChange} required className={`form-input ${fieldErrors.consultationType ? "border-red-500" : ""}`}>
                        <option value="">Select Consultation Type</option>
                        <option value="Video">Video Consultation</option>
                        <option value="Voice">Voice Consultation</option>
                        <option value="Chat">Chat Consultation</option>
                      </select>
                      {fieldErrors.consultationType && <p className="text-red-500 text-sm mt-1">{fieldErrors.consultationType}</p>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required placeholder="Emergency Contact Name" className={`form-input ${fieldErrors.emergencyContactName ? "border-red-500" : ""}`} />
                        {fieldErrors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{fieldErrors.emergencyContactName}</p>}
                      </div>
                      <div>
                        <input type="tel" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} required placeholder="Emergency Contact Number" className={`form-input ${fieldErrors.emergencyContactNumber ? "border-red-500" : ""}`} />
                        {fieldErrors.emergencyContactNumber && <p className="text-red-500 text-sm mt-1">{fieldErrors.emergencyContactNumber}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STEP 4 – REVIEW & PAYMENT ================= */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    {selectedDoctorForBooking && (
                      <div className="bg-gray-50 p-6 rounded-xl border">
                        <h3 className="font-bold mb-4">Selected Doctor:</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 relative rounded-full overflow-hidden">
                            <Image src={selectedDoctorForBooking.image} alt={selectedDoctorForBooking.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold">{selectedDoctorForBooking.name}</p>
                            <p className="text-sm text-gray-600">{selectedDoctorForBooking.designation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 p-6 rounded-xl border">
                      <h3 className="font-bold mb-4">Consultation Summary:</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Date:</strong> {formData.consultationDate}</p>
                        <p><strong>Time:</strong> {formData.consultationTime}</p>
                        <p><strong>Type:</strong> {formData.consultationType}</p>
                        <p className="pt-4 border-t"><strong>Consultation Fee:</strong> ₹500</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" required className="mt-2" />
                      <p className="text-gray-600">
                        I confirm that the information provided is accurate and agree to the consultation terms.
                      </p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading || paymentLoading || !razorpayLoaded} 
                      className="w-full bg-black text-white py-4 rounded-full hover:bg-[var(--color-primary)] transition text-lg cursor-pointer disabled:opacity-50"
                    >
                      {paymentLoading ? "Processing Payment..." : loading ? "Creating..." : razorpayLoaded ? "Pay ₹500 & Book Consultation" : "Loading Payment..."}
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-12">
                  {currentStep > 0 && (
                    <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-full cursor-pointer">Back</button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <button type="button" onClick={nextStep} className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-full cursor-pointer">Next</button>
                  )}
                </div>

              </motion.div>
            </form>

          </div>
        </div>
        </section>
      ) : (
        <section className="relative py-20 bg-[var(--color-beige)] overflow-hidden">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] leading-tight mb-6">
              Consultation
              <span className="block text-[var(--color-primary)] mt-2">Form</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">Please login to access the consultation form</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent("/consultation")}`)}
              className="px-12 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition text-lg font-semibold cursor-pointer shadow-lg"
            >
              Consult Now
            </motion.button>
          </div>
        </section>
      )}
    </div>
  );
}