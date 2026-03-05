"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 relative">

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-8">
                {isLogin ? "Login to Your Account" : "Create an Account"}
              </h2>

              {/* Form */}
              <div className="space-y-5">
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-[var(--color-primary)] outline-none"
                />

                <button className="w-full py-4 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>

              {/* Toggle */}
              <p className="text-center mt-6 text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
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