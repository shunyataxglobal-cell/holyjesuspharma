"use client";

import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { cart, getTotal } = useCart();

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold mb-10">Checkout</h1>

      {cart.map((item) => (
        <div key={item.id} className="flex justify-between mb-4">
          <p>{item.name}</p>
          <p>₹{item.price * item.quantity}</p>
        </div>
      ))}

      <div className="mt-8 text-2xl font-bold">
        Total: ₹{getTotal()}
      </div>

      <button className="mt-8 px-8 py-3 bg-[var(--color-primary)] text-white rounded-full">
        Proceed to Payment
      </button>
    </div>
  );
}