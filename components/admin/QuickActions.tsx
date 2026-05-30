"use client";

import React, { useState } from "react";
import { FolderPlus, UserCheck, Ban } from "lucide-react";
import { UploadFileModal, UnblockUserModal, BanUserModal } from "./Modals";
import RoughCardBackground from "@/components/RoughCardBackground";

export function QuickActions() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUnblockUserOpen, setIsUnblockUserOpen] = useState(false);
  const [isBanUserOpen, setIsBanUserOpen] = useState(false);

  return (
    <>
      <div className="relative p-6 rounded-2xl group/card">
        <RoughCardBackground />
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-left"
          >
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-indigo-900">Upload New Resource</p>
              <p className="text-xs text-indigo-600/70">Add files to the database</p>
            </div>
          </button>

          <button 
            onClick={() => setIsUnblockUserOpen(true)}
            className="flex items-center space-x-4 p-4 rounded-xl border border-green-100 bg-green-50/50 hover:bg-green-50 transition-colors text-left"
          >
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Unblock User</p>
              <p className="text-xs text-green-600/70">Restore access to a user</p>
            </div>
          </button>

          <button 
            onClick={() => setIsBanUserOpen(true)}
            className="flex items-center space-x-4 p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors text-left"
          >
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Ban User</p>
              <p className="text-xs text-red-600/70">Restrict a user</p>
            </div>
          </button>

          </div>
        </div>
      </div>

      <UploadFileModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <UnblockUserModal isOpen={isUnblockUserOpen} onClose={() => setIsUnblockUserOpen(false)} />
      <BanUserModal isOpen={isBanUserOpen} onClose={() => setIsBanUserOpen(false)} />
    </>
  );
}
