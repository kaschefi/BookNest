"use client";

import React from "react";
import { Folder, Users, Ban, FileText } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentFilesTable } from "@/components/admin/RecentFilesTable";
import { RecentUsersTable } from "@/components/admin/RecentUsersTable";

export default function AdminDashboard() {
  const { totalFiles, totalUsers, bannedUsers, totalCategories } = useAdmin();

  // Exclude Admin from total users count for clarity
  const activeUsersCount = totalUsers - 1; // Since 1 master admin

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Files" 
          value={totalFiles.toLocaleString()} 
          subtitle="All resources" 
          icon={Folder} 
          iconColorClass="text-indigo-600" 
          iconBgClass="bg-indigo-50"
          subtitleColorClass="text-indigo-500"
        />
        <StatCard 
          title="Total Users" 
          value={activeUsersCount.toLocaleString()} 
          subtitle="Registered users" 
          icon={Users} 
          iconColorClass="text-green-600" 
          iconBgClass="bg-green-50"
          subtitleColorClass="text-green-500"
        />
        <StatCard 
          title="Banned Users" 
          value={bannedUsers.toLocaleString()} 
          subtitle="Currently banned" 
          icon={Ban} 
          iconColorClass="text-red-600" 
          iconBgClass="bg-red-50"
          subtitleColorClass="text-red-500"
        />
        <StatCard 
          title="Total Categories" 
          value={totalCategories.toLocaleString()} 
          subtitle="All categories" 
          icon={FileText} 
          iconColorClass="text-blue-600" 
          iconBgClass="bg-blue-50"
          subtitleColorClass="text-blue-500"
        />
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFilesTable />
        <RecentUsersTable />
      </div>
    </div>
  );
}
