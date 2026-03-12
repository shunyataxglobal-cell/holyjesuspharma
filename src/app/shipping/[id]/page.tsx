"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 120,
    category: "General",
    image: "/images/products/paracetamol.jpg",
  },
  {
    id: 2,
    name: "Diabetes Care Tablets",
    price: 450,
    category: "Diabetes",
    image: "/images/products/diabetes.jpg",
  },
  {
    id: 3,
    name: "Blood Pressure Medicine",
    price: 380,
    category: "Heart",
    image: "/images/products/bp.jpg",
  },
];

export default function ShippingPage() {
  const { addToCart } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product: any) => {
    return (
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="py-28 bg-gradient-to-r from-[var(--color-beige)] to-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Online Pharmacy
          <span className="block text-[var(--color-primary)] mt-3">
            Buy Medicines Securely
          </span>
        </h1>
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Order prescribed medicines safely and get them delivered to your doorstep.
        </p>
      </section>

      {/* ================= FILTER SECTION ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">

            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-4 flex-wrap">
              {["All", "General", "Diabetes", "Heart"].map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-2 rounded-full border transition ${
                    category === cat
                      ? "bg-[var(--color-primary)] text-white"
                      : "border-gray-300 hover:border-[var(--color-primary)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* ================= PRODUCTS GRID ================= */}
          <div className="grid md:grid-cols-3 gap-10">
            {filteredProducts.map((product: any) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 relative overflow-hidden"
              >

                {/* Image */}
                <div className="relative h-56 w-full mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="text-[var(--color-primary)] font-semibold mt-2">
                  ₹{product.price}
                </p>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      if (status !== "authenticated") {
                        localStorage.setItem("pendingAddToCart", JSON.stringify({ item: product, goCheckout: true }));
                        router.push(`/login?callbackUrl=${encodeURIComponent(`/shipping/${product.id}`)}`);
                        return;
                      }
                      addToCart(product);
                      router.push("/checkout");
                    }}
                    className="flex-1 bg-black text-white py-3 rounded-full hover:bg-[var(--color-primary)] transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    className="flex-1 border border-gray-300 py-3 rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition"
                  >
                    View
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[var(--color-beige)] text-center">
        <h2 className="text-3xl font-bold">
          Need Help Choosing Medicine?
        </h2>
        <p className="mt-4 text-gray-600">
          Consult our certified doctors before purchasing.
        </p>

        <a href="/consultation">
          <button className="mt-8 px-10 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition">
            Consult Now
          </button>
        </a>
      </section>

    </div>
  );
}