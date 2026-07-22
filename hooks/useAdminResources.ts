import { useState, useEffect, useCallback, useMemo } from "react";
import { useAdmin } from "@/app/admin/AdminContext";

export interface AdminResourceItem {
    _id: string;
    title: string;
    type: string;
    fileUrl?: string;
    semester?: string;
    year?: number;
    size?: number;
    status: "approved" | "pending" | "rejected";
    lesson?: {
        name?: string;
    };
    uploadedBy?: {
        name?: string;
        email?: string;
    };
}

export function useAdminResources() {
    const { refreshData } = useAdmin();
    const [resources, setResources] = useState<AdminResourceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [search, setSearch] = useState("");

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const url = `/api/admin/resources?limit=100${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
            const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
            const res = await fetch(url, { headers });
            if (res.ok) {
                const data = await res.json();
                setResources(data.resources || []);
            }
        } catch {
            // Gracefully handle unauthorized or connection errors
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        let isMounted = true;
        const run = async () => {
            if (isMounted) await fetchResources();
        };
        run();
        return () => {
            isMounted = false;
        };
    }, [fetchResources]);

    const handleReview = useCallback(async (id: string, status: "approved" | "rejected") => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const note = prompt(`Optional review note for ${status}:`);
            if (note === null) return;

            const res = await fetch(`/api/admin/resources/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ status, reviewNote: note }),
            });

            if (res.ok) {
                await fetchResources();
                await refreshData();
            } else {
                const err = await res.json();
                alert(err.message || "Failed to submit review");
            }
        } catch (err) {
            console.error("Failed to review resource:", err);
        }
    }, [fetchResources, refreshData]);

    const handleDelete = useCallback(async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
            const res = await fetch(`/api/admin/resources/${id}`, {
                method: "DELETE",
                headers,
            });

            if (res.ok) {
                await fetchResources();
                await refreshData();
            } else {
                const err = await res.json();
                alert(err.message || "Failed to delete resource");
            }
        } catch (err) {
            console.error("Failed to delete resource:", err);
        }
    }, [fetchResources, refreshData]);

    const filteredResources = useMemo(() => {
        return resources.filter(r =>
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            (r.lesson?.name && r.lesson.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [resources, search]);

    return {
        resources: filteredResources,
        loading,
        statusFilter,
        setStatusFilter,
        search,
        setSearch,
        handleReview,
        handleDelete
    };
}
