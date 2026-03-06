"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AdminPage() {

  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">

        <button
          onClick={() => signIn("google")}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Admin Login
        </button>

      </div>
    );
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <p>Logged in as {session.user?.email}</p>

      <button
        onClick={() => signOut()}
        className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg"
      >
        Logout
      </button>

    </div>

  );
}