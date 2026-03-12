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
  const [step, setStep] = useState<"email" | "otp" | "password" | "details">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [locationLoading, setLocationLoading] = useState(false);

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

  const validatePassword = (pwd: string): string => {
    if (!pwd || pwd.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(pwd)) {
      return "Password must contain both letters and numbers";
    }
    return "";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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
        setStep("details");
        setError("Password set! Now complete your profile");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !mobile || !address.city || !address.state) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, mobile, address }),
        });

        const data = await res.json();

        if (res.ok) {
          router.push("/");
        } else {
          setError(data.error || "Failed to save profile");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          setAddress({
            ...address,
            city: data.city || data.locality || "",
            state: data.principalSubdivision || "",
            country: data.countryName || "India",
            zipCode: data.postcode || "",
          });
          setError("Location detected and filled!");
        } catch (error) {
          setError("Failed to get location details");
        }
        setLocationLoading(false);
      },
      (error) => {
        setError("Failed to get your location");
        setLocationLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)]">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-10">
          {step === "email"
            ? "Create Your Account"
            : step === "otp"
            ? "Verify OTP"
            : step === "password"
            ? "Set Password"
            : "Complete Your Profile"}
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

            <div>
              <input
                type="password"
                placeholder="Password (min 8 chars, alphanumeric)"
                required
                className={`w-full px-6 py-4 rounded-full border outline-none ${
                  password && validatePassword(password) ? "border-red-500" : password ? "border-green-500" : "border-gray-300 focus:border-[var(--color-primary)]"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error && error.includes("Password")) setError("");
                }}
              />
              {password && validatePassword(password) && (
                <p className="text-red-500 text-sm mt-1 ml-2">{validatePassword(password)}</p>
              )}
              {password && !validatePassword(password) && (
                <p className="text-green-500 text-sm mt-1 ml-2">✓ Password is valid</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className={`w-full px-6 py-4 rounded-full border outline-none ${
                  confirmPassword && password !== confirmPassword ? "border-red-500" : confirmPassword && password === confirmPassword ? "border-green-500" : "border-gray-300 focus:border-[var(--color-primary)]"
                }`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error && error.includes("match")) setError("");
                }}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1 ml-2">Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && password && (
                <p className="text-green-500 text-sm mt-1 ml-2">✓ Passwords match</p>
              )}
            </div>

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

        {step === "details" && (
          <form onSubmit={handleCompleteProfile} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              required
              disabled
              className="w-full px-6 py-4 rounded-full border border-gray-300 bg-gray-100 outline-none"
              value={email}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              type="tel"
              placeholder="Mobile Number"
              required
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Address</label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="text-xs px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition disabled:opacity-50"
                >
                  {locationLoading ? "Detecting..." : "📍 Use Current Location"}
                </button>
              </div>
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Country"
                  required
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Completing..." : "Complete Signup"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("password");
                setFirstName("");
                setLastName("");
                setMobile("");
                setAddress({ street: "", city: "", state: "", zipCode: "", country: "India" });
                setError("");
              }}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition cursor-pointer"
            >
              Back to Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}