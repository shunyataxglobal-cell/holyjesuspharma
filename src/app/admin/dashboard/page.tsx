"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Users, FileText, Pill, ShoppingBag, Mail, Stethoscope, LogOut, LayoutDashboard, Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "admin")) {
      router.replace("/");
    }
  }, [status, session, router]);

  const [users, setUsers] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        await Promise.all([
          fetch("/api/admin/users").then(r => r.json()),
          fetch("/api/admin/consultations").then(r => r.json()),
          fetch("/api/admin/orders").then(r => r.json()),
          fetch("/api/products").then(r => r.json()),
          fetch("/api/doctors").then(r => r.json())
        ]).then(([uData, cData, oData, pData, dData]) => {
          setUsers(uData.users || []);
          setConsultations(cData.consultations || []);
          setOrders(oData.orders || []);
          setProducts(pData.products || []);
          setDoctors(dData.doctors || []);
          setLoading(false);
        });
      } else if (activeTab === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
      } else if (activeTab === "consultations") {
        const res = await fetch("/api/admin/consultations");
        const data = await res.json();
        setConsultations(data.consultations || []);
        setLoading(false);
      } else if (activeTab === "orders") {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);
        setLoading(false);
      } else if (activeTab === "messages") {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        setMessages(data.messages || []);
        setLoading(false);
      } else if (activeTab === "medicines") {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
        setLoading(false);
      } else if (activeTab === "doctors") {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
        setLoading(false);
      } else if (activeTab === "faqs") {
        const res = await fetch("/api/faqs");
        const data = await res.json();
        setFaqs(data.faqs || []);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    // Also fetch doctors globally if we're in consultations tab for assignment
    if (activeTab === "consultations" && doctors.length === 0) {
      fetch("/api/doctors").then(r => r.json()).then(d => setDoctors(d.doctors || []));
    }
  }, [activeTab]);

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  // Common handlers
  const updateConsultation = async (id: string, assignedDoctor: string, statusText: string) => {
    const res = await fetch('/api/admin/consultations', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, assignedDoctor, status: statusText })
    });
    if(res.ok) fetchData();
  };

  const updateOrderStatus = async (id: string, orderStatus: string) => {
    const res = await fetch('/api/admin/orders', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: orderStatus })
    });
    if(res.ok) fetchData();
  };

  const updateUserStatus = async (id: string, role: string, verified: boolean) => {
    const res = await fetch('/api/admin/users', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role, verified })
    });
    if(res.ok) {
       toast.success("User updated successfully");
       fetchData();
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch('/api/admin/users', { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if(res.ok) { toast.success("User deleted"); fetchData(); } else toast.error("Failed to delete user");
  };

  const deleteConsultation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation?")) return;
    const res = await fetch('/api/admin/consultations', { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if(res.ok) { toast.success("Consultation deleted"); fetchData(); } else toast.error("Failed to delete consultation");
  };

  const deleteDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    const res = await fetch('/api/doctors', { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if(res.ok) { toast.success("Doctor deleted"); fetchData(); } else toast.error("Failed to delete doctor");
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { setActiveTab(id); setSearchQuery(""); }}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[#d4946e] text-white shadow-lg' 
          : 'hover:bg-gray-100 text-gray-700 hover:text-[var(--color-primary)]'
      }`}
    >
      <Icon size={22} className={activeTab === id ? "scale-110" : ""} />
      <span className="font-semibold text-[15px]">{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-32"></div>
  );

  const SkeletonTableRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
    </tr>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl flex flex-col border-r border-gray-100 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-8 py-8 border-b border-gray-100">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[#d4946e] rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Admin</h2>
              <p className="text-xs text-gray-500 font-medium">Dashboard</p>
            </div>
          </motion.div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 hide-scrollbar lg:scrollbar-thin lg:scrollbar-thumb-gray-300 lg:scrollbar-track-transparent">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" />
          <SidebarItem icon={Users} label="Users" id="users" />
          <SidebarItem icon={FileText} label="Consultations" id="consultations" />
          <SidebarItem icon={Pill} label="Medicines" id="medicines" />
          <SidebarItem icon={ShoppingBag} label="Orders" id="orders" />
          <SidebarItem icon={Stethoscope} label="Doctors" id="doctors" />
          <SidebarItem icon={Mail} label="Messages" id="messages" />
          <SidebarItem icon={FileText} label="FAQs" id="faqs" />
        </div>
        <div className="p-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-4 sm:px-6 lg:px-10 py-4 lg:py-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent capitalize tracking-tight"
            >
              {activeTab} Management
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full sm:w-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 w-full sm:w-80 border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] shadow-sm transition-all duration-300 bg-white"
              />
            </motion.div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-10 border border-gray-100 min-h-full"
          >
          
          {/* LOADING STATE */}
          {loading && activeTab === "overview" && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {!loading && activeTab === "overview" && (() => {
            // Calculate sales by day of week (last 7 days)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              return date;
            });
            
            const salesByDay = last7Days.map(date => {
              const dayStart = new Date(date);
              dayStart.setHours(0, 0, 0, 0);
              const dayEnd = new Date(date);
              dayEnd.setHours(23, 59, 59, 999);
              
              const dayOrders = orders.filter((o: any) => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= dayStart && orderDate <= dayEnd && o.paymentStatus === 'completed';
              });
              
              const totalSales = dayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
              return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: totalSales,
                count: dayOrders.length
              };
            });
            
            const maxSales = Math.max(...salesByDay.map(d => d.amount), 1);
            const salesHeights = salesByDay.map(d => Math.max((d.amount / maxSales) * 100, 5));
            
            // Calculate consultations by month (last 7 months)
            const last7Months = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (6 - i));
              return date;
            });
            
            const consultationsByMonth = last7Months.map(date => {
              const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
              const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
              
              const monthConsultations = consultations.filter((c: any) => {
                const consultDate = new Date(c.createdAt);
                return consultDate >= monthStart && consultDate <= monthEnd;
              });
              
              return {
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                count: monthConsultations.length
              };
            });
            
            const maxConsultations = Math.max(...consultationsByMonth.map(c => c.count), 1);
            const consultationHeights = consultationsByMonth.map(c => Math.max((c.count / maxConsultations) * 100, 5));
            
            return (
            <div className="space-y-6 sm:space-y-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   whileHover={{ y: -5, scale: 1.02 }}
                   className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all"
                 >
                    <div className="flex items-center justify-between mb-4">
                      <Users size={40} className="text-blue-600" />
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-2">Total Users</p>
                    <p className="text-4xl font-black text-blue-900">{users.length}</p>
                 </motion.div>
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   whileHover={{ y: -5, scale: 1.02 }}
                   className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all"
                 >
                    <div className="flex items-center justify-between mb-4">
                      <ShoppingBag size={40} className="text-green-600" />
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-2">Total Orders</p>
                    <p className="text-4xl font-black text-green-900">{orders.length}</p>
                 </motion.div>
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   whileHover={{ y: -5, scale: 1.02 }}
                   className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all"
                 >
                    <div className="flex items-center justify-between mb-4">
                      <FileText size={40} className="text-orange-600" />
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-2">Consultations</p>
                    <p className="text-4xl font-black text-orange-900">{consultations.length}</p>
                 </motion.div>
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                   whileHover={{ y: -5, scale: 1.02 }}
                   className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all"
                 >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-purple-600">₹</span>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide mb-2">Total Revenue</p>
                    <p className="text-4xl font-black text-purple-900">₹{orders.reduce((acc, o) => acc + (o.total || 0), 0).toLocaleString()}</p>
                 </motion.div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Graph 1 - Sales Overview */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg"
                  >
                     <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       Sales Overview (Last 7 Days)
                     </h3>
                     {salesByDay.some(d => d.amount > 0) ? (
                       <>
                         <div className="flex items-end justify-between h-48 sm:h-56 gap-2 sm:gap-3">
                            {salesHeights.map((h, i) => (
                               <motion.div
                                 key={i}
                                 initial={{ height: 0 }}
                                 animate={{ height: `${h}%` }}
                                 transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                                 className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-xl relative group hover:from-green-600 hover:to-green-500 transition-all shadow-md"
                               >
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg font-semibold whitespace-nowrap z-10">
                                    ₹{salesByDay[i].amount.toLocaleString()}
                                    <br />
                                    <span className="text-[10px] text-gray-300">{salesByDay[i].count} orders</span>
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                         <div className="flex justify-between mt-4 text-xs text-gray-600 font-bold uppercase tracking-wider">
                            {salesByDay.map((d, i) => (
                              <span key={i} className="text-center flex-1">{d.day}</span>
                            ))}
                         </div>
                       </>
                     ) : (
                       <div className="h-48 sm:h-56 flex items-center justify-center text-gray-400">
                         <div className="text-center">
                           <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                           <p className="text-sm">No sales data available</p>
                         </div>
                       </div>
                     )}
                  </motion.div>

                  {/* Graph 2 - Consultation Traffic */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-lg"
                  >
                     <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                       Consultation Traffic (Last 7 Months)
                     </h3>
                     {consultationsByMonth.some(c => c.count > 0) ? (
                       <>
                         <div className="flex items-end justify-between h-48 sm:h-56 gap-2 sm:gap-3">
                            {consultationHeights.map((h, i) => (
                               <motion.div
                                 key={i}
                                 initial={{ height: 0 }}
                                 animate={{ height: `${h}%` }}
                                 transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                                 className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl relative group hover:from-blue-600 hover:to-blue-500 transition-all shadow-md"
                               >
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg font-semibold whitespace-nowrap z-10">
                                    {consultationsByMonth[i].count} consultations
                                  </div>
                               </motion.div>
                            ))}
                         </div>
                         <div className="flex justify-between mt-4 text-xs text-gray-600 font-bold uppercase tracking-wider">
                            {consultationsByMonth.map((c, i) => (
                              <span key={i} className="text-center flex-1">{c.month}</span>
                            ))}
                         </div>
                       </>
                     ) : (
                       <div className="h-48 sm:h-56 flex items-center justify-center text-gray-400">
                         <div className="text-center">
                           <FileText size={48} className="mx-auto mb-2 opacity-50" />
                           <p className="text-sm">No consultation data available</p>
                         </div>
                       </div>
                     )}
                  </motion.div>
               </div>
            </div>
            );
          })()}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <>
              {loading ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Name</th>
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Email</th>
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Role</th>
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Verified</th>
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Joined</th>
                        <th className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1,2,3].map(i => <SkeletonTableRow key={i} />)}
                    </tbody>
                  </table>
                </div>
              ) : users.filter(u => u.email.includes(searchQuery.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))).length === 0 ? (
                <div className="text-center py-16">
                  <Users size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-xl font-semibold text-gray-600 mb-2">No users found</p>
                  <p className="text-gray-500">Try adjusting your search query</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Verified</th>
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                            <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.filter(u => u.email.includes(searchQuery.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))).map((user, idx) => (
                            <motion.tr
                              key={user._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm">{user.name || '-'}</td>
                              <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm break-all">{user.email}</td>
                              <td className="px-4 sm:px-6 py-4">
                                <select value={user.role} onChange={(e) => updateUserStatus(user._id, e.target.value, user.verified)} className="border-2 border-gray-200 p-2 rounded-lg outline-none focus:border-[var(--color-primary)] transition font-medium text-xs sm:text-sm w-full">
                                  <option value="user">User</option>
                                  <option value="doctor">Doctor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                <select value={user.verified ? 'true' : 'false'} onChange={(e) => updateUserStatus(user._id, user.role, e.target.value === 'true')} className="border-2 border-gray-200 p-2 rounded-lg outline-none focus:border-[var(--color-primary)] transition font-medium text-xs sm:text-sm w-full">
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 sm:px-6 py-4">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => deleteUser(user._id)}
                                  className="text-red-600 hover:text-red-700 font-semibold px-3 sm:px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition text-xs sm:text-sm"
                                >
                                  Delete
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CONSULTATIONS TAB */}
          {activeTab === "consultations" && (
            <>
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-3xl h-48"></div>
                  ))}
                </div>
              ) : consultations.filter(c => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <div className="text-center py-16">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-xl font-semibold text-gray-600 mb-2">No consultations found</p>
                  <p className="text-gray-500">Try adjusting your search query</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {consultations.filter(c => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).map((c, idx) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                      className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-lg flex flex-col lg:flex-row justify-between gap-4 sm:gap-6 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{c.fullName}</h3>
                          <span className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                            c.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                            c.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 
                            c.status === 'scheduled' ? 'bg-purple-100 text-purple-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                          <p><span className="font-semibold text-gray-700">Type:</span> {c.consultationType}</p>
                          <p className="break-all"><span className="font-semibold text-gray-700">Email:</span> {c.email}</p>
                          <p><span className="font-semibold text-gray-700">Phone:</span> {c.phone} | <span className="font-semibold text-gray-700">Age:</span> {c.age}</p>
                          <p><span className="font-semibold text-gray-700">Symptoms:</span> {c.symptoms.substring(0, 100)}{c.symptoms.length > 100 ? '...' : ''}</p>
                          <p className="text-gray-700"><span className="font-semibold">Requested:</span> {c.consultationDate} at {c.consultationTime}</p>
                          {c.scheduledDate && (
                            <p className="text-green-700 font-bold">✓ Scheduled: {c.scheduledDate} at {c.scheduledTimeIST} (IST)</p>
                          )}
                          <p className={`font-semibold ${c.paymentStatus === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                            Payment: {c.paymentStatus || 'pending'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[280px] bg-gray-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-200">
                        <label className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Assign Doctor:</label>
                        <select 
                          value={c.assignedDoctor?._id || ""}
                          onChange={(e) => updateConsultation(c._id, e.target.value, e.target.value ? 'assigned' : 'pending')}
                          className="p-2 sm:p-3 border-2 border-gray-300 rounded-lg sm:rounded-xl outline-none focus:border-[var(--color-primary)] transition font-medium text-sm"
                          disabled={c.paymentStatus !== 'completed'}
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.designation})</option>)}
                        </select>
                        {c.status === 'assigned' && c.assignedDoctor && (
                          <ConsultationScheduleForm consultationId={c._id} onSchedule={fetchData} />
                        )}
                        {c.status !== 'completed' && c.assignedDoctor && (
                           <motion.button
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             onClick={() => updateConsultation(c._id, c.assignedDoctor._id, 'completed')}
                             className="py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 cursor-pointer font-semibold shadow-lg transition-all text-sm sm:text-base"
                           >
                             Mark Completed
                           </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => deleteConsultation(c._id)}
                          className="py-2 sm:py-3 bg-red-50 text-red-600 font-bold rounded-lg sm:rounded-xl hover:bg-red-100 cursor-pointer border-2 border-red-200 transition-all text-sm sm:text-base"
                        >
                          Delete Consultation
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FAQS TAB */}
          {activeTab === "faqs" && (
            <FAQAdminPanel faqs={faqs} searchQuery={searchQuery} onRefresh={fetchData} />
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
              {orders.filter(o => o._id.includes(searchQuery) || o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(o => (
                <div key={o._id} className="p-5 border rounded-2xl bg-gray-50 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Order ID: {o._id}</h3>
                    <p className="text-sm text-gray-600 mb-1">Customer: {o.shippingAddress.fullName} | Phone: {o.shippingAddress.phone}</p>
                    <div className="text-sm text-gray-500 mb-2">Items: {o.items.map((i:any) => `${i.name} (x${i.quantity})`).join(", ")}</div>
                    <p className="font-bold text-[var(--color-primary)]">Total: ₹{o.total} <span className="text-xs text-gray-500 ml-2">({o.paymentStatus})</span></p>
                  </div>
                  <div className="flex flex-col justify-center min-w-[200px]">
                     <label className="text-sm font-medium mb-1">Track Status:</label>
                     <select 
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        className="p-2 border rounded outline-none w-full"
                     >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                     </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
             <div className="space-y-4">
                {messages.length === 0 && <p className="text-gray-500">No messages found.</p>}
                {messages.filter(m => m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
                  <div key={m._id} className="p-5 border rounded-2xl bg-white shadow-sm">
                    <h3 className="font-bold text-lg mb-1">{m.subject}</h3>
                    <p className="text-sm text-gray-500 mb-3">From: {m.name} ({m.email} / {m.phone})</p>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-xl">{m.message}</p>
                  </div>
                ))}
             </div>
          )}

          {/* DOCTORS / MEDICINES WILL HAVE ADD FORMS BELOW */}
          {(activeTab === "medicines" || activeTab === "doctors") && (
             <AdminDataPanel 
                type={activeTab} 
                data={activeTab === 'medicines' ? products : doctors} 
                searchQuery={searchQuery}
                onRefresh={fetchData}
             />
          )}

          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ConsultationScheduleForm({ consultationId, onSchedule }: any) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select date and time");
      return;
    }

    const date = new Date(`${scheduledDate}T${scheduledTime}`);
    const istTime = date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "long",
      timeStyle: "short",
    });

    setLoading(true);
    try {
      const res = await fetch("/api/consultations/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId,
          scheduledDate,
          scheduledTime,
          scheduledTimeIST: istTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Consultation scheduled! User notified via email.");
        onSchedule();
      } else {
        toast.error(data.error || "Failed to schedule");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="border-t pt-3 mt-3 space-y-2">
      <label className="text-xs font-medium text-gray-700">Schedule Consultation:</label>
      <input
        type="date"
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
        className="w-full p-2 border rounded text-xs"
        min={new Date().toISOString().split('T')[0]}
      />
      <input
        type="time"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        className="w-full p-2 border rounded text-xs"
      />
      <button
        onClick={handleSchedule}
        disabled={loading}
        className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer text-xs disabled:opacity-50"
      >
        {loading ? "Scheduling..." : "Schedule & Notify User"}
      </button>
    </div>
  );
}

function FAQAdminPanel({ faqs, searchQuery, onRefresh }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("FAQ deleted successfully!");
        onRefresh();
      } else {
        toast.error("Failed to delete FAQ");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/faqs", {
        method: formData._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({});
        toast.success(formData._id ? "FAQ updated successfully!" : "FAQ created successfully!");
        onRefresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save FAQ");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter((f: any) =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Manage FAQs</h3>
          <p className="text-sm text-gray-500 mt-1">{filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? 's' : ''} found</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowAdd(!showAdd);
            setFormData({});
          }}
          className="bg-black text-white px-6 py-3 rounded-full cursor-pointer hover:bg-[var(--color-primary)] transition font-semibold shadow-lg w-full sm:w-auto"
        >
          {showAdd ? "Cancel" : "Add New FAQ"}
        </motion.button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-2xl mb-8 border-2 border-gray-200 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">{formData._id ? "Edit" : "Add"} FAQ</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
              <input
                type="text"
                placeholder="Enter FAQ question"
                value={formData.question || ""}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Answer *</label>
              <textarea
                placeholder="Enter FAQ answer"
                value={formData.answer || ""}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={4}
                className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none focus:border-[var(--color-primary)] transition resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category || "General"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                >
                  <option value="General">General</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Security">Security</option>
                  <option value="Doctors">Doctors</option>
                  <option value="Payments">Payments</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order (for sorting)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border-2 border-gray-300 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={loading || !formData.question || !formData.answer}
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[#d4946e] text-white rounded-full font-bold cursor-pointer disabled:opacity-50 shadow-lg transition-all w-full sm:w-auto"
            >
              {loading ? "Saving..." : formData._id ? "Update FAQ" : "Create FAQ"}
            </motion.button>
          </div>
        </motion.div>
      )}

      {filteredFaqs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300"
        >
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No FAQs Found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search query" : "Get started by creating your first FAQ"}
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdd(true)}
              className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-[var(--color-primary)] transition shadow-lg"
            >
              Create New FAQ
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq: any, idx: number) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="p-4 sm:p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <span className="text-xs bg-gradient-to-r from-[var(--color-primary)] to-[#d4946e] text-white px-3 py-1 rounded-full font-semibold">{faq.category}</span>
                    <span className="text-xs text-gray-500 font-medium">Order: {faq.order}</span>
                  </div>
                  <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 break-words">{faq.question}</h4>
                  <p className="text-gray-600 mt-2 break-words">{faq.answer}</p>
                </div>
                <div className="flex gap-2 sm:ml-4 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData(faq);
                      setShowAdd(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-800 transition shadow-md"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(faq._id)}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-red-600 transition shadow-md disabled:opacity-50"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component for Medicine & Doctor CRUD
function AdminDataPanel({ type, data, searchQuery, onRefresh }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    if (type === 'doctors') form.append('folder', 'doctors');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const d = await res.json();
      if(d.url) setFormData({ ...formData, image: d.url, cloudinaryPublicId: d.publicId });
    } catch(err) {
      console.error(err);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type === 'medicines' ? 'medicine' : 'doctor'}?`)) return;
    try {
      const res = await fetch(`/api/${type === 'medicines' ? 'products' : 'doctors'}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        onRefresh();
      } else {
        toast.error("Failed to delete");
      }
    } catch(err) {
      toast.error("Something went wrong");
    }
  };

  const handleCreate = async () => {
    const isEditing = !!formData._id;
    try {
      const res = await fetch(`/api/${type === 'medicines' ? 'products' : 'doctors'}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(type === 'medicines' ? { ...formData, price: Number(formData.price) } : {
           ...formData, 
           education: typeof formData.education === 'string' ? formData.education.split(',') : formData.education,
           experience: typeof formData.experience === 'string' ? formData.experience.split(',') : formData.experience,
           interests: typeof formData.interests === 'string' ? formData.interests.split(',') : formData.interests
        })
      });
      if(res.ok) {
        setShowAdd(false);
        setFormData({});
        toast.success("Saved successfully");
        onRefresh();
      } else {
        toast.error("Failed to save");
      }
    } catch(err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const handleSeedDoctors = async () => {
    try {
      const res = await fetch('/api/admin/seed-doctors', { method: 'POST' });
      if (res.ok) {
        toast.success("Doctors seeded successfully!");
        onRefresh();
      } else {
        toast.error("Failed to seed doctors");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6 gap-4">
         {type === 'doctors' && data.length === 0 && (
           <button onClick={handleSeedDoctors} className="bg-green-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-green-700">
              Seed Doctors
           </button>
         )}
         <button onClick={() => {setShowAdd(!showAdd); setFormData({});}} className="bg-black text-white px-6 py-2 rounded-full cursor-pointer hover:bg-[var(--color-primary)]">
            {showAdd ? 'Cancel' : `Add New ${type === 'medicines' ? 'Medicine' : 'Doctor'}`}
         </button>
      </div>

      {showAdd && (
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border transition-all">
           <h3 className="text-xl font-bold mb-4">{formData._id ? 'Edit' : 'Add'} {type === 'medicines' ? 'Medicine' : 'Doctor'}</h3>
           <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-3 border rounded outline-none w-full" />
              
              {type === 'medicines' ? (
                <>
                  <input type="number" placeholder="Price" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} className="p-3 border rounded outline-none w-full" />
                  <input type="text" placeholder="Category" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="p-3 border rounded outline-none w-full" />
                </>
              ) : (
                <>
                  <input type="email" placeholder="Doctor Email (links to user account)" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-3 border rounded outline-none w-full col-span-2" />
                  <input type="text" placeholder="Designation" value={formData.designation || ''} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="p-3 border rounded outline-none w-full" />
                  <input type="text" placeholder="Hospital" value={formData.hospital || ''} onChange={(e) => setFormData({...formData, hospital: e.target.value})} className="p-3 border rounded outline-none w-full" />
                  <div className="col-span-2 space-y-4">
                    {['education', 'experience', 'interests'].map((field) => (
                      <div key={field} className="border p-4 rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-sm font-bold uppercase tracking-wider text-gray-700">{field}</label>
                           <button 
                             onClick={() => setFormData({
                               ...formData, 
                               [field]: [...(Array.isArray(formData[field]) ? formData[field] : (formData[field] ? formData[field].split(',') : [])), '']
                             })} 
                             className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-[var(--color-primary)]"
                           >
                             + Add Item
                           </button>
                        </div>
                        <div className="space-y-2">
                           {(Array.isArray(formData[field]) ? formData[field] : (formData[field] ? formData[field].split(',') : [])).map((item: string, idx: number) => (
                             <div key={idx} className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={item} 
                                 onChange={(e) => {
                                   const newArr = [...(Array.isArray(formData[field]) ? formData[field] : (formData[field] ? formData[field].split(',') : []))];
                                   newArr[idx] = e.target.value;
                                   setFormData({...formData, [field]: newArr});
                                 }} 
                                 className="flex-1 p-2 border rounded outline-none" 
                               />
                               <button 
                                 onClick={() => {
                                   const newArr = [...(Array.isArray(formData[field]) ? formData[field] : (formData[field] ? formData[field].split(',') : []))];
                                   newArr.splice(idx, 1);
                                   setFormData({...formData, [field]: newArr});
                                 }}
                                 className="px-3 bg-red-100 text-red-600 rounded hover:bg-red-200 font-bold"
                               >
                                 X
                               </button>
                             </div>
                           ))}
                           {(!formData[field] || formData[field].length === 0) && <p className="text-xs text-gray-400">No {field} added. Click + Add Item.</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="col-span-2">
                 <label className="block text-sm font-medium mb-2">Upload Image</label>
                 <input type="file" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-black cursor-pointer" />
                 {uploading && <p className="text-sm mt-2 text-blue-500">Uploading to server...</p>}
                 {formData.image && <Image src={formData.image} alt="Preview" width={100} height={100} className="mt-4 rounded-xl border" unoptimized />}
              </div>
           </div>
           <button onClick={handleCreate} disabled={uploading || !formData.name} className="mt-6 px-8 py-3 bg-[var(--color-primary)] text-white rounded-full font-bold cursor-pointer disabled:opacity-50">
             Save Item
           </button>
        </div>
      )}

      {/* Grid view of existing items */}
      <div className="grid md:grid-cols-3 gap-6">
         {data.filter((item:any) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item:any) => (
           <div key={item._id} className="border rounded-2xl p-4 flex justify-between items-center group relative overflow-hidden bg-white hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="w-16 h-16 relative bg-gray-100 rounded-xl overflow-hidden shrink-0 border">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized/>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  {type === 'medicines' ? (
                    <p className="text-[var(--color-primary)] font-semibold mt-1">₹{item.price}</p>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.designation}</p>
                  )}
                </div>
              </div>
              
             <div className="absolute right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
               <button 
                   onClick={() => {
                     setFormData(item);
                     setShowAdd(true); 
                   }}
                   className="bg-gray-900 text-white px-3 py-1 rounded text-xs cursor-pointer"
                >
                   Edit
                </button>
               <button 
                 onClick={() => handleDelete(item._id)}
                 className="bg-red-500 text-white px-3 py-1 rounded text-xs cursor-pointer"
               >
                 Delete
               </button>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}