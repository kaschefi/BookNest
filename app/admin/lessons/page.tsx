"use client";

import React from "react";
import { BookOpen, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useAdminLessons, LessonItem, FieldReference } from "@/hooks/useAdminLessons";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useLanguage } from "@/context/LanguageContext";

export default function LessonsAdminPage() {
  const {
    lessons,
    fields,
    loading,
    newLessonName,
    setNewLessonName,
    selectedFieldId,
    setSelectedFieldId,
    editingId,
    setEditingId,
    editingName,
    setEditingName,
    editingFieldId,
    setEditingFieldId,
    handleCreate,
    handleUpdate,
    handleDelete,
    getFieldName,
    getFieldId
  } = useAdminLessons();
  const { t, isRTL } = useLanguage();

  const lessonsDict = (t("subjectDetails.lessons") as unknown) as Record<string, { name: string; description: string }>;

  const getTranslatedLessonName = (rawName: string, faName?: string) => {
    if (!rawName) return rawName;
    const dict = lessonsDict;
    if (dict && typeof dict === "object") {
      if (dict[rawName]?.name) return dict[rawName].name;

      const targetKey = Object.keys(dict).find(
        (k) => k.trim().toLowerCase() === rawName.trim().toLowerCase()
      );
      if (targetKey && dict[targetKey]?.name) {
        return dict[targetKey].name;
      }
    }
    if (isRTL && faName) {
      return faName;
    }

    return rawName;
  };

  const getTranslatedFieldName = (rawName: string) => {
    if (!rawName) return rawName;
    const fieldsDict = (t("fieldsMap") as unknown) as Record<string, string>;
    if (fieldsDict && typeof fieldsDict === "object" && fieldsDict[rawName]) {
      return fieldsDict[rawName];
    }
    const match = Object.keys(fieldsDict || {}).find(
      (k) => k.trim().toLowerCase() === rawName.trim().toLowerCase()
    );
    return match ? fieldsDict[match] : rawName;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.lessonsPage.title")}</h1>
          <p className="text-gray-500 mt-1">{t("admin.lessonsPage.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Lesson Form */}
        <div className="relative p-6 rounded-2xl group/card h-fit">
          <RoughCardBackground />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("admin.modals.addLessonTitle")}</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.modals.lessonNameLabel")}</label>
                <input
                  type="text"
                  required
                  value={newLessonName}
                  onChange={(e) => setNewLessonName(e.target.value)}
                  placeholder={t("admin.modals.lessonNamePlaceholder")}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.modals.selectFieldLabel")}</label>
                <select
                  required
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white"
                >
                  <option value="" disabled>{t("admin.modals.selectFieldPlaceholder")}</option>
                  {fields.map((f: FieldReference) => (
                    <option key={f._id} value={f._id}>{getTranslatedFieldName(f.name)}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center space-x-2 rtl:space-x-reverse py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>{t("admin.lessonsPage.addLessonButton")}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Lessons List */}
        <div className="lg:col-span-2 relative p-6 rounded-2xl group/card">
          <RoughCardBackground />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("admin.lessonsPage.title")}</h3>
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-sm">{t("subjects.loadingLessons")}</div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson: LessonItem) => (
                <div
                  key={lesson._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-50 hover:border-gray-100 transition-all"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 mr-4 rtl:mr-0 rtl:ml-4">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {editingId === lesson._id ? (
                      <div className="flex-1 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm"
                        />
                        <select
                          value={editingFieldId}
                          onChange={(e) => setEditingFieldId(e.target.value)}
                          className="px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none text-sm bg-white"
                        >
                          {fields.map((f: FieldReference) => (
                            <option key={f._id} value={f._id}>{getTranslatedFieldName(f.name)}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{getTranslatedLessonName(lesson.name, lesson.faName)}</p>
                        <p className="text-xs text-indigo-600 font-medium">{getTranslatedFieldName(getFieldName(lesson.field))}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {editingId === lesson._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(lesson._id)}
                          className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(lesson._id);
                            setEditingName(lesson.name);
                            setEditingFieldId(getFieldId(lesson.field));
                          }}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                          title={t("admin.lessonsPage.edit")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id, lesson.name)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title={t("admin.lessonsPage.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-sm">{t("admin.lessonsPage.noLessonsFound")}</div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
