"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (loginMethod === "otp") {
        if (!otpSent) {
          const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, forSignup: false }),
          });

          if (res.ok) {
            setOtpSent(true);
            setMessage("OTP sent to your email");
          } else {
            const data = await res.json();
            setMessage(data.error || "Failed to send OTP");
          }
          setLoading(false);
          return;
        }

        const result = await signIn("credentials", {
          email,
          otp,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/");
          router.refresh();
        } else {
          setMessage("Invalid OTP");
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/");
          router.refresh();
        } else {
          setMessage("Invalid email or password");
        }
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)]">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-10">
          Login to Your Account
        </h2>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setPassword("");
              setOtp("");
              setOtpSent(false);
              setMessage("");
            }}
            className={`flex-1 py-2 rounded-full transition ${
              loginMethod === "password"
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("otp");
              setPassword("");
              setOtp("");
              setOtpSent(false);
              setMessage("");
            }}
            className={`flex-1 py-2 rounded-full transition ${
              loginMethod === "otp"
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            OTP
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.includes("sent") || message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {loginMethod === "password" ? (
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : otpSent ? (
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : loginMethod === "otp"
              ? otpSent
                ? "Login"
                : "Send OTP"
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}