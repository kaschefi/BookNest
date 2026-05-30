"use client";

import React, { useState } from "react";
import { useAdmin } from "@/app/admin/AdminContext";
import { X } from "lucide-react";

export function UploadFileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addFile } = useAdmin();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category && size) {
      addFile(name, category, size);
      setName("");
      setCategory("");
      setSize("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upload New Resource</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Name (with extension)</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Notes.pdf" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category / Field</label>
            <input type="text" required value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Size (in MB)</label>
            <input type="number" step="0.1" required value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. 2.5" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Upload File
          </button>
        </form>
      </div>
    </div>
  );
}

export function UnblockUserModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { users, unblockUser } = useAdmin();
  const [selectedUserId, setSelectedUserId] = useState("");

  if (!isOpen) return null;

  const bannedUsers = users.filter(u => u.status === "Banned");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      unblockUser(selectedUserId);
      setSelectedUserId("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Unblock User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Banned User</label>
            <select 
              required 
              value={selectedUserId} 
              onChange={e => setSelectedUserId(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              <option value="" disabled>Select a user...</option>
              {bannedUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={!selectedUserId || bannedUsers.length === 0} className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
            Unblock User
          </button>
        </form>
      </div>
    </div>
  );
}

export function BanUserModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { users, banUser } = useAdmin();
  const [selectedUserId, setSelectedUserId] = useState("");

  if (!isOpen) return null;

  const activeUsers = users.filter(u => u.status === "Active" && u.role !== "Admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      banUser(selectedUserId);
      setSelectedUserId("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ban User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Active User</label>
            <select 
              required 
              value={selectedUserId} 
              onChange={e => setSelectedUserId(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="" disabled>Select a user...</option>
              {activeUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={!selectedUserId || activeUsers.length === 0} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
            Restrict User
          </button>
        </form>
      </div>
    </div>
  );
}
