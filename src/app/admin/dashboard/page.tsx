"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Users, FileText, Pill, ShoppingBag, Mail, Stethoscope, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      if (activeTab === "overview") {
        Promise.all([
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
        });
      } else if (activeTab === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
      } else if (activeTab === "consultations") {
        const res = await fetch("/api/admin/consultations");
        const data = await res.json();
        setConsultations(data.consultations || []);
      } else if (activeTab === "orders") {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (activeTab === "messages") {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        setMessages(data.messages || []);
      } else if (activeTab === "medicines") {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } else if (activeTab === "doctors") {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
      }
    } catch (e) {
      console.error(e);
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
    <button
      onClick={() => { setActiveTab(id); setSearchQuery(""); }}
      className={`w-full flex items-center gap-3 px-6 py-4 transition ${activeTab === id ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col pt-12">
        <div className="px-6 mb-10">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" />
          <SidebarItem icon={Users} label="Users" id="users" />
          <SidebarItem icon={FileText} label="Consultations" id="consultations" />
          <SidebarItem icon={Pill} label="Medicines" id="medicines" />
          <SidebarItem icon={ShoppingBag} label="Orders" id="orders" />
          <SidebarItem icon={Stethoscope} label="Doctors" id="doctors" />
          <SidebarItem icon={Mail} label="Messages" id="messages" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 pt-28">
        
        {/* Top Bar Filter */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{activeTab} Management</h1>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-full outline-none focus:border-[var(--color-primary)] shadow-sm"
          />
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center items-center text-center">
                    <Users size={32} className="text-blue-500 mb-2" />
                    <p className="text-gray-500 font-medium">Total Users</p>
                    <p className="text-3xl font-black text-blue-900">{users.length}</p>
                 </div>
                 <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col justify-center items-center text-center">
                    <ShoppingBag size={32} className="text-green-500 mb-2" />
                    <p className="text-gray-500 font-medium">Total Orders</p>
                    <p className="text-3xl font-black text-green-900">{orders.length}</p>
                 </div>
                 <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col justify-center items-center text-center">
                    <FileText size={32} className="text-orange-500 mb-2" />
                    <p className="text-gray-500 font-medium">Consultations</p>
                    <p className="text-3xl font-black text-orange-900">{consultations.length}</p>
                 </div>
                 <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col justify-center items-center text-center">
                    <span className="text-2xl font-black text-purple-500 mb-2">₹</span>
                    <p className="text-gray-500 font-medium">Total Revenue</p>
                    <p className="text-3xl font-black text-purple-900">{orders.reduce((acc, o) => acc + o.total, 0)}</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Fake Graph 1 */}
                  <div className="border rounded-2xl p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 text-gray-800">Sales Overview</h3>
                     <div className="flex items-end justify-between h-48 gap-2">
                        {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                           <div key={i} className="w-full bg-green-100 rounded-t-md relative group hover:bg-green-300 transition" style={{ height: `${h}%` }}>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">+{h}%</div>
                           </div>
                        ))}
                     </div>
                     <div className="flex justify-between mt-2 text-xs text-gray-500 font-semibold uppercase">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                     </div>
                  </div>

                  {/* Fake Graph 2 */}
                  <div className="border rounded-2xl p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-4 text-gray-800">Consultation Traffic</h3>
                     <div className="flex items-end justify-between h-48 gap-2">
                        {[20, 30, 80, 50, 40, 90, 100].map((h, i) => (
                           <div key={i} className="w-full bg-blue-100 rounded-t-md relative group hover:bg-blue-300 transition" style={{ height: `${h}%` }}>
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">{h} Apps</div>
                           </div>
                        ))}
                     </div>
                     <div className="flex justify-between mt-2 text-xs text-gray-500 font-semibold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b bg-gray-50"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Verified</th><th className="p-4">Joined</th><th className="p-4">Actions</th></tr></thead>
                <tbody>
                  {users.filter(u => u.email.includes(searchQuery.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))).map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{user.name || '-'}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                         <select value={user.role} onChange={(e) => updateUserStatus(user._id, e.target.value, user.verified)} className="border p-2 rounded outline-none w-full">
                            <option value="user">User</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                         </select>
                      </td>
                      <td className="p-4">
                         <select value={user.verified ? 'true' : 'false'} onChange={(e) => updateUserStatus(user._id, user.role, e.target.value === 'true')} className="border p-2 rounded outline-none w-full">
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                         </select>
                      </td>
                      <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                         <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-700 font-semibold px-2 py-1 bg-red-50 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CONSULTATIONS TAB */}
          {activeTab === "consultations" && (
            <div className="space-y-6">
              {consultations.length === 0 && <p className="text-gray-500">No consultations found.</p>}
              {consultations.filter(c => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                <div key={c._id} className="p-5 border rounded-2xl bg-gray-50 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{c.fullName} - {c.consultationType}</h3>
                    <p className="text-sm text-gray-600 mb-1">Email: {c.email} | Phone: {c.phone} | Age: {c.age}</p>
                    <p className="text-sm text-gray-600 mb-1">Symptoms: {c.symptoms}</p>
                    <p className="text-sm font-medium mt-2">Date: {c.consultationDate} Time: {c.consultationTime}</p>
                    <p className={`mt-2 font-bold uppercase text-sm ${c.status === 'pending' ? 'text-orange-500' : c.status === 'assigned' ? 'text-blue-500' : 'text-green-500'}`}>Status: {c.status}</p>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[250px]">
                    <label className="text-sm font-medium">Assign Doctor:</label>
                    <select 
                      value={c.assignedDoctor?._id || ""}
                      onChange={(e) => updateConsultation(c._id, e.target.value, e.target.value ? 'assigned' : 'pending')}
                      className="p-2 border rounded outline-none"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.designation})</option>)}
                    </select>
                    {c.status !== 'completed' && c.assignedDoctor && (
                       <button onClick={() => updateConsultation(c._id, c.assignedDoctor._id, 'completed')} className="mt-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
                         Mark Completed
                       </button>
                    )}
                    <button onClick={() => deleteConsultation(c._id)} className="mt-2 py-2 bg-red-50 text-red-500 font-semibold rounded hover:bg-red-100 cursor-pointer">
                      Delete Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

        </div>
      </div>
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
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const d = await res.json();
      if(d.url) setFormData({ ...formData, image: d.url });
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