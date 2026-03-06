"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "@/components/auth/AuthModal";
import { useCart } from "@/context/CartContext";

import { useSession, signOut } from "next-auth/react";

export default function Header() {

  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { cartItems } = useCart();

  const { data: session } = useSession();

  const cartCount = cartItems?.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  const isAdmin =
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto open auth on first visit
  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      setAuthOpen(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Consultation", path: "/consultation" },
    { name: "Conditions", path: "/conditions" },
    { name: "Networks", path: "/networks" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Shipping", path: "/shipping" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white shadow-xl"
            : "bg-white/70 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-9 lg:px-9 h-28">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/main logo.png"
              alt="Holy Jesus Pharma"
              width={110}
              height={50}
              priority
              className="object-contain"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10 text-m font-medium tracking-wide">

            {navItems.map((item) => {

              const isActive = pathname === item.path;

              return (
                <div key={item.name} className="relative group">

                  <Link
                    href={item.path}
                    className={`transition duration-300 ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "text-gray-700 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {item.name}
                  </Link>

                  <span
                    className={`absolute left-0 -bottom-2 h-[2px] bg-[var(--color-primary)] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />

                </div>
              );
            })}

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            <Search className="w-5 h-5 hidden md:block cursor-pointer text-gray-600 hover:text-[var(--color-primary)] transition" />

            {/* USER ICON */}

            <div className="relative">

              <button
                onClick={() => {

                  if (!session) {
                    setAuthOpen(true);
                  } else {
                    setUserMenu(!userMenu);
                  }

                }}
              >
                <User className="w-5 h-5 cursor-pointer text-gray-600 hover:text-[var(--color-primary)] transition" />
              </button>

              {/* USER DROPDOWN */}

              {userMenu && session && (

                <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl p-3 z-50">

                  <p className="text-sm text-gray-500 mb-2">
                    {session.user?.email}
                  </p>

                  <Link
                    href="/profile"
                    className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Edit Profile
                  </Link>

                  {isAdmin && (

                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      Admin Dashboard
                    </Link>

                  )}

                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>

                </div>

              )}

            </div>

            {/* CART */}

            <button
              onClick={() => router.push("/cart")}
              className="relative hidden md:block"
            >

              <ShoppingCart className="w-5 h-5 cursor-pointer text-gray-600 hover:text-[var(--color-primary)] transition" />

              {cartCount > 0 && (

                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {cartCount}
                </span>

              )}

            </button>

            {/* CTA */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/consultation")}
              className="hidden md:block bg-black text-white px-6 py-2 rounded-full shadow-lg hover:bg-[var(--color-primary)] transition"
            >
              Consult Now
            </motion.button>

            {/* MOBILE MENU */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* MOBILE NAV */}

        <AnimatePresence>

          {mobileOpen && (

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="lg:hidden bg-white shadow-xl"
            >

              <div className="flex flex-col px-6 py-6 gap-5">

                {navItems.map((item) => (

                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-gray-700 hover:text-[var(--color-primary)] transition"
                  >
                    {item.name}
                  </Link>

                ))}

                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMobileOpen(false);
                  }}
                  className="bg-black text-white py-3 rounded-full mt-4"
                >
                  Login / Sign Up
                </button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* Accent Line */}

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"></div>

      </motion.header>

      {/* AUTH MODAL */}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

    </>
  );
}