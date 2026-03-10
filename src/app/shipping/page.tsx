"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function ShippingPage() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p: any) => p.category)))];

  const filteredProducts = products.filter((product: any) => {
    const matchCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-28 pb-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* PAGE TITLE */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            Online Medicine Store
          </h1>
          <p className="text-gray-600 mt-4">
            Search and order medicines easily
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none shadow-sm"
            />
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full transition ${
                selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No medicines found.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

  {filteredProducts.map((product: any) => (
    <motion.div
      key={product._id}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
    >

      {/* IMAGE */}
      <div className="relative h-52 bg-gray-50 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={180}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-1 text-center">

        <h3 className="text-lg font-semibold mb-2">
          {product.name}
        </h3>

        <p className="text-xl font-bold text-[var(--color-primary)] mb-6">
          ₹{product.price}
        </p>

        <button
          onClick={() => addToCart({ ...product, id: product._id })}
          className="mt-auto bg-black text-white py-3 rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer"
        >
          Add to Cart
        </button>

      </div>

    </motion.div>
  ))}

</div>
        )}

      </div>
    </div>
  );
}