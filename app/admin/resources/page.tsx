"use client";

import React from "react";
import { useAdminResources, AdminResourceItem } from "@/hooks/useAdminResources";
import { FileText, File, FileArchive, FileCode, Check, X, Trash2, Search, ExternalLink } from "lucide-react";
import RoughCardBackground from "@/components/RoughCardBackground";

export default function ResourcesAdminPage() {
  const {
    resources,
    loading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    handleReview,
    handleDelete
  } = useAdminResources();

  const getFileIcon = (title: string) => {
    const ext = title.split('.').pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
      case "doc":
        return <File className="h-5 w-5 text-blue-500" />;
      case "zip":
      case "rar":
        return <FileArchive className="h-5 w-5 text-purple-500" />;
      default:
        return <FileCode className="h-5 w-5 text-slate-500" />;
    }
  };

  const getFileIconBg = (title: string) => {
    const ext = title.split('.').pop()?.toLowerCase();
    switch (ext) {
      case "pdf": return "bg-red-50";
      case "docx":
      case "doc": return "bg-blue-50";
      case "zip":
      case "rar": return "bg-purple-50";
      default: return "bg-slate-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Moderation</h1>
          <p className="text-gray-500 mt-1">Review student uploads, approve study notes, or reject materials</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-8">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`pb-4 text-sm font-semibold capitalize relative transition-colors ${
              statusFilter === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative p-6 rounded-2xl group/card">
        <RoughCardBackground />
        <div className="relative z-10">
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-sm">Loading resources...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pt-2 pl-4">File Name</th>
                  <th className="pb-3 pt-2">Topic / Lesson</th>
                  <th className="pb-3 pt-2">Uploaded By</th>
                  <th className="pb-3 pt-2">Size</th>
                  <th className="pb-3 pt-2">Status</th>
                  <th className="pb-3 pt-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {resources.map((res: AdminResourceItem) => (
                  <tr key={res._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getFileIconBg(res.title)}`}>
                          {getFileIcon(res.title)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm flex items-center">
                            {res.title}
                            {res.fileUrl && (
                              <a href={res.fileUrl} target="_blank" rel="noreferrer" className="ml-1.5 text-indigo-500 hover:text-indigo-700">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{res.type} • {res.semester} {res.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-700 font-medium">
                      {res.lesson?.name || "Unassigned"}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-800">{res.uploadedBy?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-400">{res.uploadedBy?.email || ""}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {res.size ? (res.size / (1024 * 1024)).toFixed(1) + " MB" : "N/A"}
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        res.status === "approved" ? "bg-green-50 text-green-700" :
                        res.status === "pending" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {res.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleReview(res._id, "approved")}
                              title="Approve Resource"
                              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReview(res._id, "rejected")}
                              title="Reject Resource"
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(res._id, res.title)}
                          title="Permanently Delete"
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 text-sm">
                      No resources found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
