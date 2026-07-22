"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type UserStatus = "Active" | "Banned";

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  creationDate: string;
  role: "Admin" | "User";
}

export interface FileResource {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "ZIP" | "OTHER";
  category: string;
  uploadDate: string;
  size: string;
}

interface ApiUser {
  _id: string;
  name: string;
  last_name?: string;
  email: string;
  status?: UserStatus;
  createdAt?: string;
  role: string;
}

interface ApiResource {
  _id: string;
  title: string;
  createdAt?: string;
  size?: number;
  lesson?: {
    name?: string;
  };
}

interface AdminContextType {
  users: User[];
  files: FileResource[];
  unblockUser: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  addFile: (name: string, category: string, size: string) => void;
  totalFiles: number;
  totalUsers: number;
  bannedUsers: number;
  totalCategories: number;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<FileResource[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalUsers: 0,
    bannedUsers: 0,
    totalCategories: 0,
  });

  const getFileExtension = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() : "OTHER";
  };

  const getFileType = (ext: string | undefined): "PDF" | "DOCX" | "ZIP" | "OTHER" => {
    if (ext === "PDF" || ext === "DOCX" || ext === "ZIP") return ext;
    if (ext === "DOC" || ext === "DOCX") return "DOCX";
    return "OTHER";
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {
        ...options.headers,
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      };
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return null;
        }
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      return await response.json();
    } catch {
      return null;
    }
  };

  const refreshData = useCallback(async () => {
    try {
      const [statsData, usersResult, resourcesResult] = await Promise.all([
        fetchWithAuth("/api/admin/stats"),
        fetchWithAuth("/api/admin/users?limit=100"),
        fetchWithAuth("/api/admin/resources?limit=100")
      ]);

      if (!statsData || !usersResult || !resourcesResult) {
        return;
      }

      setStats({
        totalFiles: statsData.resources?.total || 0,
        totalUsers: statsData.users?.total || 0,
        bannedUsers: statsData.users?.banned || 0,
        totalCategories: statsData.catalog?.fields || 0
      });

      const mappedUsers: User[] = (usersResult.users || []).map((u: ApiUser) => ({
        id: u._id,
        name: `${u.name} ${u.last_name || ""}`.trim(),
        email: u.email,
        status: u.status || "Active",
        creationDate: u.createdAt 
          ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : "N/A",
        role: u.role === "admin" ? "Admin" : "User"
      }));
      setUsers(mappedUsers);

      const mappedFiles: FileResource[] = (resourcesResult.resources || []).map((r: ApiResource) => {
        const ext = r.title.split('.').pop()?.toUpperCase() || "OTHER";
        return {
          id: r._id,
          name: r.title,
          type: getFileType(ext),
          category: r.lesson?.name || "Other",
          uploadDate: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : "N/A",
          size: r.size ? (r.size / (1024 * 1024)).toFixed(1) + " MB" : "0.0 MB"
        };
      });
      setFiles(mappedFiles);
    } catch (err) {
      console.error("Failed to load admin context data:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (isMounted) await refreshData();
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [refreshData]);

  const addFile = async (name: string, category: string, size: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: name,
          type: "pamphlet",
          fileUrl: "/placeholder.pdf",
          year: new Date().getFullYear(),
          semester: "fall",
          status: "approved"
        }),
      });
      if (res.ok) {
        await refreshData();
      } else {
        // Fallback for UI if offline/testing
        const ext = getFileExtension(name);
        const newFile: FileResource = {
          id: Date.now().toString(),
          name,
          type: getFileType(ext),
          category,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: size + " MB"
        };
        setFiles(prev => [newFile, ...prev]);
      }
    } catch (err) {
      console.error("Failed to persist file upload:", err);
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "Active" }),
      });
      if (res.ok) {
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to unblock user");
      }
    } catch (err) {
      console.error("Failed to unblock user:", err);
    }
  };

  const banUser = async (userId: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "Banned" }),
      });
      if (res.ok) {
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to ban user");
      }
    } catch (err) {
      console.error("Failed to ban user:", err);
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      files,
      unblockUser,
      banUser,
      addFile,
      totalFiles: stats.totalFiles,
      totalUsers: stats.totalUsers,
      bannedUsers: stats.bannedUsers,
      totalCategories: stats.totalCategories,
      refreshData
    }}>
      {children}
    </AdminContext.Provider>
  );
};
