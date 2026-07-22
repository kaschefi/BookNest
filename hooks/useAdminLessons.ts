import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/app/admin/AdminContext";

export interface FieldReference {
  _id: string;
  name: string;
  slug?: string;
}

export interface LessonItem {
  _id: string;
  name: string;
  slug?: string;
  field?: string | FieldReference;
}

export function useAdminLessons() {
  const { refreshData } = useAdmin();
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [fields, setFields] = useState<FieldReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLessonName, setNewLessonName] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingFieldId, setEditingFieldId] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

      const [lessonsRes, fieldsRes] = await Promise.all([
        fetch("/api/admin/lessons", { headers }),
        fetch("/api/admin/fields", { headers })
      ]);

      if (lessonsRes.ok && fieldsRes.ok) {
        const lessonsData = await lessonsRes.json();
        const fieldsData = await fieldsRes.json();
        setLessons(lessonsData);
        setFields(fieldsData);
      }
    } catch {
      // Gracefully handle unauthorized or connection errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (isMounted) await fetchData();
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonName.trim() || !selectedFieldId) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newLessonName, fieldId: selectedFieldId }),
      });

      if (res.ok) {
        setNewLessonName("");
        await fetchData();
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create lesson");
      }
    } catch (err) {
      console.error("Failed to create lesson:", err);
    }
  }, [newLessonName, selectedFieldId, fetchData, refreshData]);

  const handleUpdate = useCallback(async (id: string) => {
    if (!editingName.trim() || !editingFieldId) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: editingName, fieldId: editingFieldId }),
      });

      if (res.ok) {
        setEditingId(null);
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update lesson");
      }
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
  }, [editingName, editingFieldId, fetchData]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? related files/resources might lose their reference!`)) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });

      if (res.ok) {
        await fetchData();
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete lesson");
      }
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    }
  }, [fetchData, refreshData]);

  const getFieldName = (field?: string | FieldReference) => {
    if (!field) return "None";
    if (typeof field === "string") {
      const found = fields.find(f => f._id === field);
      return found ? found.name : field;
    }
    return field.name || "None";
  };

  const getFieldId = (field?: string | FieldReference) => {
    if (!field) return "";
    return typeof field === "string" ? field : field._id || "";
  };

  return {
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
  };
}
