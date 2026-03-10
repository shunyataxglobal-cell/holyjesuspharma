"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);
  return <div className="min-h-screen bg-[var(--color-beige)] flex items-center justify-center">Loading...</div>;
}