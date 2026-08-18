
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useLanguage } from "@/context/LanguageContext";
import {
  Home,
  FolderOpen,
  Users,
  LayoutGrid,
  BookOpen,
  LogOut,
  BookMarked,
  User
} from "lucide-react";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const { handleSignOut } = useAuthStatus();
  const { t, isRTL } = useLanguage();

  const links = [
    { name: t("admin.sidebar.dashboard"), href: "/admin", icon: Home },
    { name: t("admin.sidebar.filesAndResources"), href: "/admin/resources", icon: FolderOpen },
    { name: t("admin.sidebar.users"), href: "/admin/users", icon: Users },
    { name: t("admin.sidebar.fields"), href: "/admin/fields", icon: LayoutGrid },
    { name: t("admin.sidebar.lessons"), href: "/admin/lessons", icon: BookOpen },
    { name: t("admin.sidebar.myProfile"), href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        dir="ltr"
        className={`fixed inset-y-0 left-0 bg-white w-64 border-r border-gray-100 flex flex-col transition-transform duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BookMarked className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">BookNest</h1>
              <p className="text-sm text-indigo-600 font-medium">Admin Panel</p>
            </div>
          </div>
          {/* Spacer for sliding Menu button */}
          <div className="w-10 h-10" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t("admin.sidebar.logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

