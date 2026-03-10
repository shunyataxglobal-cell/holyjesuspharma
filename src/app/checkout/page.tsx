"use client";

import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { cartItems } = useCart();

  const cart = cartItems || [];
  const total = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold mb-10">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item: any) => (
            <div key={item.id} className="flex justify-between mb-4">
              <p>{item.name}</p>
              <p>₹{item.price * item.quantity}</p>
            </div>
          ))}

          <div className="mt-8 text-2xl font-bold">
            Total: ₹{total}
          </div>

          <button className="mt-8 px-8 py-3 bg-[var(--color-primary)] text-white rounded-full">
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
}