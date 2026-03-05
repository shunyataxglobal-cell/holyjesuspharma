import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Holy Jesus Pharma RX",
  description:
    "Online Doctor Consultation and Pharmacy - Consultation Delivered to Your Doorstep Anywhere in the World.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-white text-[var(--color-dark)]`}
      >
        <Providers>
          <CartProvider>
            <div className="flex flex-col min-h-screen">

              {/* Header */}
              <Header />

              {/* Main Content */}
              <main className="flex-1 pt-24">
                {children}
              </main>

              {/* Footer */}
              <Footer />

            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}