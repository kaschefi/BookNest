"use client";

import React from "react";
import { useAdmin } from "@/app/admin/AdminContext";
import { User } from "lucide-react";
import RoughCardBackground from "@/components/RoughCardBackground";

export function RecentUsersTable() {
  const { users } = useAdmin();
  
  // Show only normal users in the recent list for clarity, or show all. The image showed Ali, Sara, Hassan, Zainab.
  const displayUsers = users.filter(u => u.role !== "Admin");

  return (
    <div className="relative p-6 rounded-2xl h-full group/card">
      <RoughCardBackground />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Users</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
        </div>

      <div className="space-y-4">
        {displayUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <p className="text-sm text-gray-600 hidden sm:block">{user.creationDate}</p>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.status === 'Active' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {user.status}
              </div>
            </div>
          </div>
        ))}
          {displayUsers.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
