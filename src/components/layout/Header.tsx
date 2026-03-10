"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
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

  const userRole = (session?.user as any)?.role || "user";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      setAuthOpen(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

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
          scrolled ? "bg-white shadow-xl" : "bg-white/80 backdrop-blur-xl"
        }`}
      >

        {/* MAIN CONTAINER */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 h-24">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/main logo.png"
              alt="Holy Jesus Pharma"
              width={95}
              height={40}
              priority
              className="object-contain"
            />
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-700">

            {navItems.map((item: any) => {

              const isActive = pathname === item.path;

              return (
                <div key={item.name} className="relative group">

                  <Link
                    href={item.path}
                    className={`transition duration-300 ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "hover:text-[var(--color-primary)]"
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
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <Search className="w-5 h-5 hidden md:block cursor-pointer text-gray-600 hover:text-[var(--color-primary)] transition" />

            {/* USER MENU */}
            {session && (

              <div className="relative">

                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1"
                >
                  <User className="w-5 h-5 text-gray-600 hover:text-[var(--color-primary)]" />
                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      userMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl p-3">

                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                    >
                      Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t my-2"></div>

                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-red-500 cursor-pointer"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>

            )}

            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="relative hidden md:block"
            >

              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-[var(--color-primary)]" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}

            </button>

            {/* BUTTONS */}
            <div className="hidden md:flex items-center gap-4">

              {!session && (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition cursor-pointer"
                >
                  Login Now
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/consultation")}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-[var(--color-primary)] transition cursor-pointer"
              >
                Consult Now
              </motion.button>

            </div>

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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white shadow-xl"
            >

              <div className="flex flex-col px-6 py-6 gap-4">

                {navItems.map((item: any) => (

                  <Link
                    key={item.name}
                    href={item.path}
                    className="text-gray-700 hover:text-[var(--color-primary)]"
                  >
                    {item.name}
                  </Link>

                ))}

                {!session && (
                  <button
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileOpen(false);
                    }}
                    className="bg-black text-white py-3 rounded-full mt-4 cursor-pointer"
                  >
                    Login / Sign Up
                  </button>
                )}

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* LINE */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"></div>

      </motion.header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}