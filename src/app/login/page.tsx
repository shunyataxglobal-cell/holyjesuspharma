"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)]">

      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-10">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}