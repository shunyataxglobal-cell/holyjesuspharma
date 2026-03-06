"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (loginMethod === "otp") {
        if (!otp) {
          const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, forSignup: false }),
          });

          if (res.ok) {
            setError("OTP sent to your email");
          } else {
            const data = await res.json();
            setError(data.error || "Failed to send OTP");
          }
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (res.ok) {
          const signInRes = await signIn("credentials", {
            email: data.user.email,
            userId: data.user.id,
            redirect: false,
          });

          if (signInRes?.ok) {
            onClose();
            router.push("/");
          } else {
            setError("Login failed");
          }
        } else {
          setError(data.error || "Invalid OTP");
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          const signInRes = await signIn("credentials", {
            email: data.user.email,
            userId: data.user.id,
            redirect: false,
          });

          if (signInRes?.ok) {
            onClose();
            router.push("/");
          } else {
            setError("Login failed");
          }
        } else {
          setError(data.error || "Invalid credentials");
        }
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          onClose();
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

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setError("");
    setStep("email");
    setLoginMethod("password");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-center mb-8">
                {isLogin
                  ? "Login to Your Account"
                  : step === "email"
                  ? "Create an Account"
                  : step === "otp"
                  ? "Verify OTP"
                  : "Set Password"}
              </h2>

              {error && (
                <div
                  className={`mb-4 p-3 rounded-lg text-center text-sm ${
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

              {isLogin ? (
                <>
                  <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("password");
                        setPassword("");
                        setOtp("");
                        setError("");
                      }}
                      className={`flex-1 py-2 rounded-full transition text-sm ${
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
                        setError("");
                      }}
                      className={`flex-1 py-2 rounded-full transition text-sm ${
                        loginMethod === "otp"
                          ? "bg-black text-white"
                          : "text-gray-600"
                      }`}
                    >
                      OTP
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <input
                      type="email"
                      placeholder="Email Address"
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
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        required={!!otp}
                        maxLength={6}
                        className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none text-center text-xl tracking-widest"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      />
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
                    >
                      {loading
                        ? "Processing..."
                        : loginMethod === "otp"
                        ? otp
                          ? "Login"
                          : "Send OTP"
                        : "Login"}
                    </button>
                  </form>
                </>
              ) : step === "email" ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <input
                    type="email"
                    placeholder="Email Address"
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
              ) : step === "otp" ? (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <input
                    type="email"
                    placeholder="Email Address"
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
                    className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none text-center text-xl tracking-widest"
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
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <input
                    type="email"
                    placeholder="Email Address"
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

              <p className="text-center mt-6 text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    resetForm();
                  }}
                  className="ml-2 text-[var(--color-primary)] font-medium cursor-pointer"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}