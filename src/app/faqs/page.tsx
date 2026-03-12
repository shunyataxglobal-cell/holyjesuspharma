"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (data.faqs) {
          setFaqs(data.faqs);
          const cats = Array.from(new Set(data.faqs.map((f: any) => f.category))) as string[];
          setCategories(cats.length > 0 ? cats : ["General"]);
          if (cats.length > 0) setSelectedCategory(cats[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.category === selectedCategory &&
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="py-28 bg-gradient-to-br from-[var(--color-beige)] to-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Help Center &
          <span className="block text-[var(--color-primary)]">
            FAQs
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about consultations, doctors, security, and payments.
        </p>

        {/* SEARCH BAR */}
        <div className="mt-10 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your question..."
            className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-12">

          {/* LEFT CATEGORY NAV */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-beige)] p-6 rounded-3xl shadow-md sticky top-24">
              <h3 className="font-semibold mb-6">Categories</h3>
              <div className="space-y-3">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveIndex(null);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-full transition ${
                      selectedCategory === cat
                        ? "bg-[var(--color-primary)] text-white"
                        : "hover:bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT FAQ LIST */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <p className="text-gray-500">Loading FAQs...</p>
            ) : filteredFaqs.length === 0 ? (
              <p className="text-gray-500">
                No questions found for this search.
              </p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
                >
                  <button
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>
                    <span className="text-2xl font-bold">
                      {activeIndex === index ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-gray-600">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[var(--color-beige)] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Still Need Help?
        </h2>
        <p className="text-gray-600 mb-8">
          Our support team is ready to assist you anytime.
        </p>
        <Link href="/contact">
          <button className="px-10 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer">
            Contact Support
          </button>
        </Link>
      </section>

     

    </div>
  );
}