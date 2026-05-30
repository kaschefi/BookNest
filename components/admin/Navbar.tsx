"use client";

import React from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { useAdmin } from "@/app/admin/AdminContext";

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { users } = useAdmin();
  const adminUser = users.find(u => u.role === "Admin") || { name: "Admin" };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <button 
          onClick={toggleSidebar}
          className="hidden lg:block p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {adminUser.name.charAt(0)}
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">Admin</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
