"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e:any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin/dashboard"
    });

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-3xl shadow-xl w-[400px]"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-6"
        />

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Login
        </button>

      </form>

    </div>
  );
}