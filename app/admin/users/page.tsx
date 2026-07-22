"use client";

import React from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { User as UserIcon, Shield, Ban, CheckCircle } from "lucide-react";
import RoughCardBackground from "@/components/RoughCardBackground";
import { User } from "../AdminContext";

export default function UsersAdminPage() {
  const { users, search, setSearch, banUser, unblockUser } = useAdminUsers();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage platform access, roles, and restrictions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white"
          />
        </div>
      </div>

      <div className="relative p-6 rounded-2xl group/card">
        <RoughCardBackground />
        <div className="relative z-10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 pt-2 pl-4">User</th>
                <th className="pb-3 pt-2">Role</th>
                <th className="pb-3 pt-2">Joined</th>
                <th className="pb-3 pt-2">Status</th>
                <th className="pb-3 pt-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 pl-4 flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${user.role === "Admin" ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"}`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Admin" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-800"
                    }`}>
                      {user.role === "Admin" && <Shield className="mr-1 h-3.5 w-3.5" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{user.creationDate}</td>
                  <td className="py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    {user.role !== "Admin" ? (
                      user.status === "Active" ? (
                        <button
                          onClick={() => banUser(user.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          <span>Restrict</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => unblockUser(user.id)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-medium transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Unblock</span>
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Cannot Modify Admin</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
