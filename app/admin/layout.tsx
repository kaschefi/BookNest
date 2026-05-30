"use client";

import React, { useState, useEffect } from "react";
import { AdminProvider } from "./AdminContext";
import { Sidebar } from "@/components/admin/Sidebar";
import MainNavbar from "@/components/layout/Navbar";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen bg-transparent font-sans">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex flex-col min-h-screen">
          <div className="bg-transparent px-4 md:px-8 flex justify-center z-10 w-full relative">
            <MainNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          </div>
          <main className="flex-1 p-4 lg:p-8 relative max-w-7xl mx-auto w-full">
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
