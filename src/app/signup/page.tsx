"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, forSignup: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
        setError("OTP sent to your email");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("password");
        setError("OTP verified! Now set your password");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        const signInRes = await signIn("credentials", {
          email: data.user.email,
          userId: data.user.id,
          redirect: false,
        });

        if (signInRes?.ok) {
          router.push("/");
        } else {
          setError("Signup failed");
        }
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)]">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-10">
          {step === "email"
            ? "Create Your Account"
            : step === "otp"
            ? "Verify OTP"
            : "Set Password"}
        </h2>

        {error && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              error.includes("sent") ||
              error.includes("verified") ||
              error.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              required
              disabled
              className="w-full px-6 py-4 rounded-full border border-gray-300 bg-gray-100 outline-none"
              value={email}
            />

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
              }}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition cursor-pointer"
            >
              Change Email
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleSignup} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              required
              disabled
              className="w-full px-6 py-4 rounded-full border border-gray-300 bg-gray-100 outline-none"
              value={email}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("otp");
                setPassword("");
                setConfirmPassword("");
                setError("");
              }}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition cursor-pointer"
            >
              Back to OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}