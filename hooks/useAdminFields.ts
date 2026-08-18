import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/app/admin/AdminContext";

export interface FieldItem {
  _id: string;
  name: string;
  faName?: string;
  slug: string;
}

export function useAdminFields() {
  const { refreshData } = useAdmin();
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
      const res = await fetch("/api/admin/fields", { headers });
      if (res.ok) {
        const data = await res.json();
        setFields(data);
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
      if (isMounted) await fetchFields();
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [fetchFields]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/admin/fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: newFieldName }),
      });

      if (res.ok) {
        setNewFieldName("");
        await fetchFields();
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create field");
      }
    } catch (err) {
      console.error("Failed to create field:", err);
    }
  }, [newFieldName, fetchFields, refreshData]);

  const handleUpdate = useCallback(async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/admin/fields/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: editingName }),
      });

      if (res.ok) {
        setEditingId(null);
        await fetchFields();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update field");
      }
    } catch (err) {
      console.error("Failed to update field:", err);
    }
  }, [editingName, fetchFields]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the field "${name}"? This might affect related lessons and resources!`)) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
      const res = await fetch(`/api/admin/fields/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        await fetchFields();
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete field");
      }
    } catch (err) {
      console.error("Failed to delete field:", err);
    }
  }, [fetchFields, refreshData]);

  return {
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
  };
}
