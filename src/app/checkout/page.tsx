"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [rzpReady, setRzpReady] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const cart = cartItems || [];
  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + gst;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      if (!(window as any).Razorpay) {
        alert("Payment system is still loading. Please try again in a moment.");
        setLoading(false);
        return;
      }
      const orderData = {
        items: cart.map((i: any) => ({
          product: i.id || i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        subtotal,
        shipping,
        gst,
        discount: 0,
        total,
        shippingAddress: address
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        // Init Razorpay Checkkout
        const options = {
          key: data.keyId,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: "Holy Jesus PharmaRX",
          description: "Online Medicine Purchase",
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/orders", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const vData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              alert("Payment successful! Order placed.");
              router.push("/dashboard/orders");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: session?.user?.name || address.fullName,
            email: session?.user?.email || "user@example.com",
            contact: address.phone,
          },
          theme: {
            color: "#E6A57E",
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function (response: any) {
          alert("Payment Failed: " + response.error.description);
        });

      } else {
        alert(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  const handleChange = (e: any) => setAddress({ ...address, [e.target.name]: e.target.value });

  if (status === "loading") return <div className="text-center pt-32">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRzpReady(true)} />
      <h1 className="text-4xl font-bold mb-10">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border">
            <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
              <input type="text" name="fullName" value={address.fullName} onChange={handleChange} placeholder="Full Name" required className="form-input w-full" />
              <input type="tel" name="phone" value={address.phone} onChange={handleChange} placeholder="Phone Number" required className="form-input w-full" />
              <input type="text" name="street" value={address.street} onChange={handleChange} placeholder="Street Address" required className="form-input w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="City" required className="form-input w-full" />
                <input type="text" name="state" value={address.state} onChange={handleChange} placeholder="State" required className="form-input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} placeholder="Zip Code" required className="form-input w-full" />
                <input type="text" name="country" value={address.country} onChange={handleChange} placeholder="Country" required className="form-input w-full" />
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-8 rounded-3xl shadow-lg h-fit border">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item: any) => (
                <div key={item.id || item._id} className="flex justify-between items-center text-gray-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-gray-700">
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
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading || !rzpReady}
              className="mt-8 w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition disabled:opacity-50 font-semibold cursor-pointer"
            >
              {loading ? "Processing..." : !rzpReady ? "Loading payment..." : "Pay with Razorpay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}