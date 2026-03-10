"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && params.id) {
      fetchOrder();
    }
  }, [status, router, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } catch {
      console.error("Failed to load order");
    }
    setLoading(false);
  };

  if (loading || status === "loading") return <div className="text-center pt-32 min-h-screen bg-[var(--color-beige)]">Loading Order Details...</div>;
  if (!order) return <div className="text-center pt-32 min-h-screen bg-[var(--color-beige)]">Order not found.</div>;

  const getStatusStep = () => {
     switch(order.status) {
        case 'processing': return 1;
        case 'shipped': return 2;
        case 'delivered': return 3;
        case 'cancelled': return 0;
        default: return 1;
     }
  };

  const step = getStatusStep();

  return (
    <div className="min-h-screen bg-[var(--color-beige)] pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium">
           <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
           <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer font-medium shadow-sm">
             <Printer size={18} /> Download Invoice
           </button>
        </div>

        {/* TRACKING PROGRESS */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border mb-8 print:hidden">
           <h2 className="text-xl font-bold mb-8">Tracking Progress</h2>
           {order.status === 'cancelled' ? (
              <div className="text-red-500 font-bold p-4 bg-red-50 rounded-lg text-center">This order was cancelled.</div>
           ) : (
              <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Package size={20} />
                   </div>
                   <span className={`font-semibold text-sm ${step >= 1 ? 'text-green-600' : 'text-gray-500'}`}>Processing</span>
                </div>
                
                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <Truck size={20} />
                   </div>
                   <span className={`font-semibold text-sm ${step >= 2 ? 'text-green-600' : 'text-gray-500'}`}>Shipped</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <CheckCircle size={20} />
                   </div>
                   <span className={`font-semibold text-sm ${step >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Delivered</span>
                </div>
              </div>
           )}
        </div>

        {/* INVOICE TICKET */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border relative print:shadow-none print:border-none print:p-0">
           
           <div className="flex justify-between items-start border-b pb-8 mb-8">
              <div>
                 <h2 className="text-2xl font-black text-[var(--color-primary)]">Holy Jesus PharmaRX</h2>
                 <p className="text-gray-500 text-sm mt-1">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                 <p className="text-gray-500 text-sm mt-1">Payment Method: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</p>
                 <p className="text-gray-500 text-sm mt-1">Transaction ID: {order.razorpayPaymentId || 'N/A'}</p>
              </div>
              <div className="text-right">
                 <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm mb-2">Shipping To</h3>
                 <p className="font-semibold text-lg text-gray-900">{order.shippingAddress.fullName}</p>
                 <p className="text-gray-600">{order.shippingAddress.phone}</p>
                 <p className="text-gray-600 max-w-[200px] mt-2">
                   {order.shippingAddress.street}, {order.shippingAddress.city}, <br />
                   {order.shippingAddress.state} - {order.shippingAddress.zipCode} <br />
                   {order.shippingAddress.country}
                 </p>
              </div>
           </div>

           <div className="mb-8">
              <table className="w-full text-left">
                <thead>
                   <tr className="border-b-2 border-gray-100">
                     <th className="py-3 font-semibold text-gray-600">Item</th>
                     <th className="py-3 font-semibold text-gray-600">Price</th>
                     <th className="py-3 font-semibold text-gray-600">Qty</th>
                     <th className="py-3 font-semibold text-gray-600 text-right">Total</th>
                   </tr>
                </thead>
                <tbody>
                   {order.items.map((item:any, idx:number) => (
                      <tr key={idx} className="border-b border-gray-100">
                         <td className="py-4 font-medium">{item.name}</td>
                         <td className="py-4 text-gray-600">₹{item.price}</td>
                         <td className="py-4 text-gray-600">{item.quantity}</td>
                         <td className="py-4 font-semibold text-right">₹{item.price * item.quantity}</td>
                      </tr>
                   ))}
                </tbody>
              </table>
           </div>

           <div className="flex justify-end text-gray-700">
             <div className="w-64 space-y-3">
                <div className="flex justify-between"><span>Subtotal</span> <span className="font-medium">₹{order.subtotal}</span></div>
                <div className="flex justify-between"><span>GST (5%)</span> <span className="font-medium">₹{order.gst}</span></div>
                <div className="flex justify-between"><span>Shipping</span> <span className="font-medium">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
                <div className="flex justify-between text-xl font-black text-black pt-4 border-t-2 border-gray-100 mt-4">
                   <span>Total</span> <span>₹{order.total}</span>
                </div>
             </div>
           </div>

           <div className="mt-16 text-center text-sm text-gray-400 font-medium tracking-wide">
             THANK YOU FOR CHOOSING HOLY JESUS PHARMARX
           </div>

        </div>

      </div>
    </div>
  );
}
