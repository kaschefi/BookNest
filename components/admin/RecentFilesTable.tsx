"use client";

import React from "react";
import { useAdmin } from "@/app/admin/AdminContext";
import { FileText, FileArchive, File, FileCode } from "lucide-react";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export function RecentFilesTable() {
  const { files } = useAdmin();
  const { t } = useLanguage();

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "DOCX":
        return <File className="h-6 w-6 text-blue-500" />;
      case "ZIP":
        return <FileArchive className="h-6 w-6 text-purple-500" />;
      default:
        return <FileCode className="h-6 w-6 text-gray-500" />;
    }
  };

  const getFileIconBg = (type: string) => {
    switch (type) {
      case "PDF": return "bg-red-50";
      case "DOCX": return "bg-blue-50";
      case "ZIP": return "bg-purple-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="relative p-6 rounded-2xl h-full group/card">
      <RoughCardBackground />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">{t("admin.dashboard.recentFiles")}</h3>
          <Link href="/admin/resources" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">{t("admin.dashboard.viewAll")}</Link>
        </div>

      <div className="space-y-4">
        {files.map(file => (
          <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`p-2 rounded-lg ${getFileIconBg(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{file.category}</p>
              </div>
            </div>
            <div className="text-right rtl:text-left">
              <p className="text-sm text-gray-600">{file.uploadDate}</p>
              <p className="text-xs text-gray-400">{file.size}</p>
            </div>
          </div>
        ))}
          {files.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">{t("admin.dashboard.noFiles")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
