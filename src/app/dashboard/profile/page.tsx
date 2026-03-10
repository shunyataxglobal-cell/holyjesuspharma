"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, FileText, ShoppingBag, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Data States
  const [consultations, setConsultations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  useEffect(() => {
    if (activeTab === "consultations" || activeTab === "orders") {
      fetchData();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
        setImage(data.user.image || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [consRes, ordRes] = await Promise.all([
        fetch("/api/consultations"),
        fetch("/api/orders")
      ]);
      const consData = await consRes.json();
      const ordData = await ordRes.json();
      setConsultations(consData.consultations || []);
      setOrders(ordData.orders || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch data");
    }
    setLoadingData(false);
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const d = await res.json();
      if(d.url) {
        setImage(d.url);
        toast.success("Image uploaded, save to apply");
      }
    } catch(err) {
      toast.error("Failed to upload image");
    }
    setUploadingImage(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, image }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleCompleteConsultation = async (id: string, currentAssignedDoctor: string) => {
     try {
       const res = await fetch('/api/admin/consultations', {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ id, assignedDoctor: currentAssignedDoctor, status: 'completed' })
       });
       if(res.ok) {
         toast.success("Consultation marked as completed!");
         fetchData();
       } else {
         toast.error("Failed to update consultation");
       }
     } catch(err) {
       toast.error("Something went wrong");
     }
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 transition ${activeTab === id ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      <Icon size={20} />
      <span className="font-medium text-left flex-1">{label}</span>
      {id === 'consultations' && consultations.filter(c => new Date(c.consultationDate) >= new Date() && c.status === 'assigned').length > 0 && (
         <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
           {consultations.filter(c => new Date(c.consultationDate) >= new Date() && c.status === 'assigned').length}
         </span>
      )}
    </button>
  );

  if (status === "loading") {
    return <div className="min-h-screen pt-32 text-center text-gray-500">Loading your profile...</div>;
  }

  if (!session) return null;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col hidden md:flex border-r shrink-0">
        <div className="px-6 mb-6 pt-6 text-center">
           <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden mb-3 bg-gray-100 border-2 border-gray-100 shadow-sm">
             {image ? <Image src={image} fill alt="Profile" className="object-cover" unoptimized/> : <User size={40} className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
           </div>
           <h2 className="text-lg font-bold truncate">{name || session.user?.email?.split('@')[0]}</h2>
           <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarItem icon={User} label="Profile Details" id="profile" />
          <SidebarItem icon={FileText} label="Consultations" id="consultations" />
          <SidebarItem icon={ShoppingBag} label="My Orders" id="orders" />
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-3 px-6 py-5 text-red-500 hover:bg-red-50 border-t">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 hide-scrollbar pb-32">
         
         <div className="max-w-4xl mx-auto">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500">Manage your account details and password.</p>
                  </div>
                  <Link href="/consultation" className="bg-black text-white px-6 py-2 rounded-full hover:bg-[var(--color-primary)] transition font-semibold shadow-sm shrink-0">
                    + Book Appointment
                  </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><User size={20} className="text-[var(--color-primary)]"/> Personal Information</h2>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="flex items-center gap-6 mb-6">
                       <div className="w-24 h-24 relative rounded-full overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                         {image ? <img src={image} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                          <input type="file" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-black cursor-pointer transition-colors" />
                          {uploadingImage && <p className="text-sm text-blue-500 mt-2 font-medium">Uploading to server...</p>}
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400 font-normal">(locked)</span></label>
                        <input type="email" value={email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-colors" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none transition-colors" placeholder="e.g. +91 9876543210" />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={loading || uploadingImage} className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full hover:opacity-90 transition font-bold disabled:opacity-50 cursor-pointer shadow-md">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><span className="text-[var(--color-primary)] font-black text-2xl">*</span> Change Password</h2>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" required />
                    </div>
                    <div>
                      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" required minLength={6} />
                    </div>
                    <div className="mb-6">
                      <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none" required minLength={6} />
                    </div>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition font-bold disabled:opacity-50 mt-4 cursor-pointer">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* CONSULTATIONS TAB */}
            {activeTab === 'consultations' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Consultation History</h1>
                  {(session?.user as any)?.role !== 'doctor' && (
                    <Link href="/consultation" className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-[var(--color-primary)] transition">Book New</Link>
                  )}
                </div>

                {loadingData ? <div className="text-center py-10">Loading consultations...</div> : (
                  <>
                    {consultations.filter(c => new Date(c.consultationDate) >= new Date() && c.status === 'assigned').length > 0 && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl shadow-sm mb-6 flex items-start gap-4 animate-bounce-short">
                          <span className="text-blue-500 text-3xl">📅</span>
                          <div>
                            <h3 className="font-bold text-blue-900 text-lg">Upcoming Appointments Reminder</h3>
                            <p className="text-sm text-blue-800 mt-1">
                              You have {consultations.filter(c => new Date(c.consultationDate) >= new Date() && c.status === 'assigned').length} upcoming consultation(s). Please be ready 5 minutes before the scheduled time. Your doctor will connect with you via your registered email or phone.
                            </p>
                          </div>
                      </div>
                    )}
                    
                    {consultations.length === 0 ? (
                      <div className="bg-white rounded-2xl p-10 text-center border shadow-sm">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">No Consultations Yet</h3>
                        {(session?.user as any)?.role === 'doctor' ? (
                          <p className="text-gray-500 mt-2 mb-6">You have not been assigned any consultations yet.</p>
                        ) : (
                          <>
                            <p className="text-gray-500 mt-2 mb-6">Book your first doctor consultation online today.</p>
                            <Link href="/consultation" className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-bold">Book Appointment</Link>
                          </>
                        )}
                      </div>
                    ) : (
                      consultations.map((c) => (
                        <div key={c._id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${c.status === 'pending' ? 'bg-orange-400' : c.status === 'assigned' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            <div className="pl-3">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{c.consultationType} Consultation</h3>
                              <p className="text-gray-500 text-sm mb-4">ID: {c._id.slice(-8).toUpperCase()}</p>
                              
                              <div className="space-y-2 text-sm text-gray-700">
                                <p><strong className="font-semibold text-gray-900">Patient:</strong> {c.fullName} ({c.age} yrs)</p>
                                <p><strong className="font-semibold text-gray-900">Date & Time:</strong> {new Date(c.consultationDate).toLocaleDateString()} at {c.consultationTime}</p>
                                <p><strong className="font-semibold text-gray-900">Symptoms:</strong> {c.symptoms}</p>
                              </div>
                              
                              <div className={`mt-5 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${c.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' : c.status === 'assigned' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                Status: {c.status}
                              </div>
                            </div>

                            <div className="md:w-72 shrink-0 bg-gray-50 p-5 rounded-xl border flex flex-col justify-center items-center text-center">
                              {c.assignedDoctor ? (
                                <>
                                  <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-3">Assigned</span>
                                  <div className="w-20 h-20 relative rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm bg-white">
                                    <Image src={c.assignedDoctor.image} alt={c.assignedDoctor.name} fill className="object-cover" unoptimized />
                                  </div>
                                  <p className="font-bold text-gray-900">{c.assignedDoctor.name}</p>
                                  <p className="text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wider mt-1">{c.assignedDoctor.designation}</p>
                                  <p className="text-xs text-gray-500 mt-2 bg-white px-3 py-1 rounded-full border mb-3">{c.assignedDoctor.hospital}</p>
                                  {(session?.user as any)?.role === 'doctor' && c.status === 'assigned' && (
                                     <button 
                                       onClick={() => handleCompleteConsultation(c._id, c.assignedDoctor._id)}
                                       className="bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-green-700 transition w-full"
                                     >
                                        Mark as Completed
                                     </button>
                                  )}
                                </>
                              ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                     <User size={20} className="text-gray-400" />
                                  </div>
                                  <p className="text-sm font-medium">Doctor assignment pending</p>
                                  <p className="text-xs mt-1">We will notify you soon.</p>
                                </div>
                              )}
                            </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                  <Link href="/shipping" className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-[var(--color-primary)] transition">Shop Medicines</Link>
                </div>

                {loadingData ? <div className="text-center py-10">Loading orders...</div> : (
                  <>
                    {orders.length === 0 ? (
                      <div className="bg-white rounded-2xl p-10 text-center border shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">No Orders Placed</h3>
                        <p className="text-gray-500 mt-2 mb-6">You haven't purchased any medicines yet.</p>
                        <Link href="/shipping" className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full font-bold">Go to Pharmacy</Link>
                      </div>
                    ) : (
                      orders.map((o) => (
                        <div key={o._id} className="bg-white border rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 mb-4">
                              <div>
                                <p className="font-bold text-gray-900">Order #{o._id.slice(-8).toUpperCase()}</p>
                                <p className="text-xs text-gray-500 mt-1">Placed on {new Date(o.createdAt).toLocaleString()}</p>
                              </div>
                              <div className="mt-4 md:mt-0 flex gap-3 text-sm font-semibold">
                                <span className={`px-4 py-1.5 rounded-full ${o.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                                  {o.paymentStatus.toUpperCase()}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full ${o.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                  {o.status.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
                              {o.items.map((item:any, idx:number) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 relative bg-white rounded-lg overflow-hidden shrink-0 border">
                                          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                  </div>
                              ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-end gap-4 p-5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl">
                              <div className="w-full md:w-auto">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Shipping Details</p>
                                <p className="text-sm font-medium">{o.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-300">{o.shippingAddress.phone}</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-[250px]">{o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.zipCode}</p>
                              </div>
                              <div className="w-full md:w-auto text-left md:text-right border-t border-gray-700 md:border-none pt-4 md:pt-0">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Total Paid</p>
                                <p className="text-3xl font-black text-white">₹{o.total}</p>
                                <Link href={`/dashboard/orders/${o._id}`} className="inline-block mt-3 bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition shadow-sm">
                                    Track Order & Invoice
                                </Link>
                              </div>
                            </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            )}

         </div>
      </div>
    </div>
  );
}
