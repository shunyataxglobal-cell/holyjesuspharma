"use client";

import { signOut, useSession } from "next-auth/react";

export default function AdminDashboard() {

  const { data: session } = useSession();

  return (

    <div className="p-10">

      <h1 className="text-4xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <p className="mb-6">
        Welcome {session?.user?.email}
      </p>

      <button
        onClick={()=>signOut()}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Logout
      </button>

    </div>

  );
}