"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface AdminContextType {
  users: User[];
  files: FileResource[];
  unblockUser: (userId: string) => void;
  banUser: (userId: string) => void;
  addFile: (name: string, category: string, size: string) => void;
  totalFiles: number;
  totalUsers: number;
  bannedUsers: number;
  totalCategories: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

const initialUsers: User[] = [
  { id: "1", name: "Admin (Master)", email: "admin@platform.com", status: "Active", creationDate: "May 18, 2024", role: "Admin" },
  { id: "2", name: "Ali Raza", email: "ali.raza@example.com", status: "Active", creationDate: "May 18, 2024", role: "User" },
  { id: "3", name: "Sara Khan", email: "sara.khan@example.com", status: "Active", creationDate: "May 18, 2024", role: "User" },
  { id: "4", name: "Hassan Ali", email: "hassan.ali@example.com", status: "Active", creationDate: "May 17, 2024", role: "User" },
  { id: "5", name: "Zainab Fatima", email: "zainab.fatima@example.com", status: "Banned", creationDate: "May 17, 2024", role: "User" },
];

const initialFiles: FileResource[] = [
  { id: "1", name: "Data Structures - Notes.pdf", type: "PDF", category: "Computer Science", uploadDate: "May 18, 2024", size: "2.4 MB" },
  { id: "2", name: "Thermodynamics - Book.pdf", type: "PDF", category: "Physics", uploadDate: "May 17, 2024", size: "5.1 MB" },
  { id: "3", name: "Organic Chemistry - Notes.docx", type: "DOCX", category: "Chemistry", uploadDate: "May 16, 2024", size: "1.8 MB" },
  { id: "4", name: "Calculus - Worksheet.zip", type: "ZIP", category: "Mathematics", uploadDate: "May 15, 2024", size: "3.2 MB" },
];

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [files, setFiles] = useState<FileResource[]>(initialFiles);

  const getFileExtension = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()?.toUpperCase() : "OTHER";
  };

  const getFileType = (ext: string | undefined): "PDF" | "DOCX" | "ZIP" | "OTHER" => {
    if (ext === "PDF" || ext === "DOCX" || ext === "ZIP") return ext;
    if (ext === "DOC" || ext === "DOCX") return "DOCX";
    return "OTHER";
  };

  const addFile = (name: string, category: string, size: string) => {
    const ext = getFileExtension(name);
    const newFile: FileResource = {
      id: Date.now().toString(),
      name,
      type: getFileType(ext),
      category,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: size + " MB"
    };
    setFiles([newFile, ...files]);
  };

  const unblockUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: "Active" } : u));
  };

  const banUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: "Banned" } : u));
  };

  const totalFiles = files.length;
  const totalUsers = users.length;
  const bannedUsers = users.filter(u => u.status === "Banned").length;
  const totalCategories = new Set(files.map(f => f.category)).size;

  return (
    <AdminContext.Provider value={{
      users,
      files,
      unblockUser,
      banUser,
      addFile,
      totalFiles,
      totalUsers,
      bannedUsers,
      totalCategories
    }}>
      {children}
    </AdminContext.Provider>
  );
};
