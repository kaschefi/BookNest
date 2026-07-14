"use client";

import React, { useState, useEffect } from "react";
import { AdminProvider } from "./AdminContext";
import { Sidebar } from "@/components/admin/Sidebar";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/layout/Navbar";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, status, isJwtLoggedIn, isInitialized } = useAuthStatus();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run redirect logic when session loading has finished AND local storage is parsed
    if (status !== "loading" && isInitialized) {
      // If we've checked the local JWT and NextAuth session and neither is admin
      if (!isAdmin) {
        if (!isJwtLoggedIn && status === "unauthenticated") {
            router.push("/login");
        } else {
            router.push("/");
        }
      } else {
          setIsReady(true);
      }
    }
  }, [isAdmin, status, isJwtLoggedIn, isInitialized, router]);

  if (!isReady) {
      return <div className="min-h-screen flex items-center justify-center font-hand text-xl text-slate-600">Verifying access...</div>;
  }

  return (
    <AdminProvider>
      <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12 bg-transparent font-sans">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Sliding Menu Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed z-40 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all duration-300 bg-white shadow-sm border border-slate-200"
          style={{
            left: sidebarOpen ? "196px" : "max(32px, calc((100vw - 1280px) / 2 + 32px))",
            top: sidebarOpen ? "24px" : "32px"
          }}
          title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <Menu className="h-6 w-6" />
        </button>

        <MainNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} hideSidebarButton={true} hideLogo={true} />

        <main className="relative flex-1 flex flex-col w-full max-w-7xl mt-4">
          <div className="relative z-10 w-full">
            {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}
