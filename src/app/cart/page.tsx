"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [coupon, setCoupon] = useState("");

  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const gst = Math.round(subtotal * 0.05);
  const discount = coupon === "SAVE10" ? Math.round(subtotal * 0.1) : 0;

  const total = subtotal + shipping + gst - discount;

  return (
    <div className="bg-gradient-to-b from-white to-[var(--color-beige)] min-h-screen pt-32 pb-20">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-12">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mt-4">
              Browse medicines and add them to your cart.
            </p>

            <Link href="/shipping">
              <button className="mt-8 px-10 py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition">
                Shop Medicines
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-16">

            {/* LEFT SIDE - PRODUCTS */}
            <div className="lg:col-span-2 space-y-10">

              {cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-8 bg-white rounded-3xl shadow-lg p-8"
                >
                  <div className="relative w-40 h-40 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">

                    <h3 className="text-xl font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-[var(--color-primary)] text-lg font-bold mt-3">
                      ₹{item.price}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mt-6">

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-10 h-10 bg-gray-200 rounded-full"
                      >
                        -
                      </button>

                      <span className="text-lg font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-10 h-10 bg-gray-200 rounded-full"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-6 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>

            {/* RIGHT SIDE - SUMMARY */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 h-fit sticky top-32">

              <h3 className="text-2xl font-semibold mb-8">
                Order Summary
              </h3>

              <div className="space-y-4 text-gray-700">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

              </div>

              {/* Coupon */}
              <div className="mt-8">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full px-5 py-3 border rounded-full focus:border-[var(--color-primary)] outline-none"
                />
              </div>

              <div className="border-t mt-8 pt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button className="w-full mt-8 bg-black text-white py-4 rounded-full hover:bg-[var(--color-primary)] transition text-lg">
                Proceed to Secure Checkout
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}