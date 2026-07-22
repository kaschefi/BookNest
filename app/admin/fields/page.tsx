"use client";

import React from "react";
import { LayoutGrid, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useAdminFields, FieldItem } from "@/hooks/useAdminFields";
import RoughCardBackground from "@/components/RoughCardBackground";

export default function FieldsAdminPage() {
  const {
    fields,
    loading,
    newFieldName,
    setNewFieldName,
    editingId,
    setEditingId,
    editingName,
    setEditingName,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useAdminFields();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fields of Study</h1>
          <p className="text-gray-500 mt-1">Configure study programs and academic departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Field Form */}
        <div className="relative p-6 rounded-2xl group/card h-fit">
          <RoughCardBackground />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Field of Study</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Create Field</span>
              </button>
            </form>
          </div>
        </div>

        {/* Fields List */}
        <div className="lg:col-span-2 relative p-6 rounded-2xl group/card">
          <RoughCardBackground />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Existing Fields</h3>
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-sm">Loading fields...</div>
          ) : (
            <div className="space-y-3">
              {fields.map((field: FieldItem) => (
                <div
                  key={field._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-100 transition-all"
                >
                  <div className="flex items-center space-x-3 flex-1 mr-4">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <LayoutGrid className="h-5 w-5" />
                    </div>
                    {editingId === field._id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                      />
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{field.name}</p>
                        <p className="text-xs text-gray-400">Slug: {field.slug}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingId === field._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(field._id)}
                          className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(field._id);
                            setEditingName(field.name);
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(field._id, field.name)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No academic fields added yet.
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
