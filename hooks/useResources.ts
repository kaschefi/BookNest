"use client";

import { useState, useEffect, useCallback } from "react";

export interface Resource {
    _id: string;
    title: string;
    type: "midterm" | "final" | "pamphlet";
    semester: "fall" | "spring" | "summer";
    year: number;
    fileUrl: string;
    downloads: number;
    views: number;
    voteScore: number;
    createdAt: string;
    lesson: { _id: string; name: string; slug: string };
    uploadedBy: { name: string; email: string; avatarUrl?: string };
}

export interface ResourceFilters {
    search?: string;
    lessonId?: string;
    type?: "midterm" | "final" | "pamphlet" | "";
    semester?: "fall" | "spring" | "summer" | "";
    year?: number | "";
    sortBy?: "newest" | "popular" | "votes";
    page?: number;
}

export function useResources(initialFilters: ResourceFilters = {}) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ResourceFilters>({
        sortBy: "newest",
        page: 1,
        ...initialFilters,
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.set("search", filters.search);
            if (filters.lessonId) params.set("lessonId", filters.lessonId);
            if (filters.type) params.set("type", filters.type);
            if (filters.semester) params.set("semester", filters.semester);
            if (filters.year) params.set("year", String(filters.year));
            if (filters.sortBy) params.set("sortBy", filters.sortBy);
            if (filters.page) params.set("page", String(filters.page));

            const res = await fetch(`/api/files?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch resources");
            const data = await res.json();
            setResources(data.resources);
            setPagination(data.pagination);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to load resources";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        let isMounted = true;
        const runFetch = async () => {
            if (isMounted) {
                await fetchResources();
            }
        };
        runFetch();
        return () => {
            isMounted = false;
        };
    }, [fetchResources]);

    const updateFilter = (key: keyof ResourceFilters, value: ResourceFilters[keyof ResourceFilters]) => {
        setFilters(prev => ({ ...prev, [key]: value, page: key !== "page" ? 1 : (value as number) }));
    };

    return { resources, loading, error, filters, pagination, updateFilter, refetch: fetchResources };
}