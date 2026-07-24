"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useResources, Resource, ResourceFilters } from "@/hooks/useResources";
import { Search, Download, ThumbsUp, ThumbsDown, Eye, Filter, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function ResourcesPage() {
    const { resources, loading, error, filters, pagination, updateFilter, refetch } = useResources();
    const { isLoggedIn } = useAuthStatus();
    const [userVotes, setUserVotes] = useState<Record<string, number>>({});

    const handleVote = async (resourceId: string, value: 1 | -1) => {
        if (!isLoggedIn) {
            alert("Please sign in to vote on notes.");
            return;
        }

        const currentVote = userVotes[resourceId] || 0;
        const newVote = currentVote === value ? 0 : value;

        // Optimistic update
        setUserVotes(prev => ({ ...prev, [resourceId]: newVote }));

        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(`/api/files/${resourceId}/vote`, {
                method: "POST",
                headers,
                body: JSON.stringify({ value }),
            });

            if (res.ok) {
                refetch();
            } else {
                // Rollback
                setUserVotes(prev => ({ ...prev, [resourceId]: currentVote }));
            }
        } catch {
            setUserVotes(prev => ({ ...prev, [resourceId]: currentVote }));
        }
    };

    const handleDownload = async (resource: Resource) => {
        try {
            await fetch(`/api/files/${resource._id}/download`, { method: "POST" });
        } catch (err) {
            console.error("Failed to increment download count:", err);
        }
        window.open(resource.fileUrl, "_blank");
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12 bg-[#fdfaf6]">
            {/* Lined Notebook Margins */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-6 w-full max-w-[1200px]">
                {/* Header Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight uppercase font-sans">
                        Notes Search & Directory
                    </h1>
                    <p className="font-hand text-[22px] text-slate-700 font-medium text-center mt-2 max-w-2xl mx-auto">
                        Search and filter study notes, midterms, finals, and pamphlets across all subjects and lessons.
                    </p>
                </div>

                {/* Main Search & Filter Box */}
                <div className="w-full bg-[#fdfaf6] border border-slate-400 p-6 rounded-[16px] shadow-lg mb-8 space-y-4">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <div className="relative flex items-center bg-white border border-slate-400 rounded-xl shadow-sm focus-within:border-blue-500 overflow-hidden">
                            <Search className="w-6 h-6 ml-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search notes by title, topic, or lesson..."
                                value={filters.search || ""}
                                onChange={(e) => updateFilter("search", e.target.value)}
                                className="w-full pl-3 pr-4 py-3.5 bg-transparent text-slate-800 font-sans text-base focus:outline-none placeholder-slate-400"
                            />
                        </div>
                    </div>

                    {/* Filter Controls Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-hand text-slate-700 font-bold mb-1">
                                Note Type:
                            </label>
                            <select
                                value={filters.type || ""}
                                onChange={(e) => updateFilter("type", e.target.value as ResourceFilters["type"])}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-sans text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                            >
                                <option value="">All Types</option>
                                <option value="midterm">Midterm</option>
                                <option value="final">Final</option>
                                <option value="pamphlet">Extra / Pamphlet</option>
                            </select>
                        </div>

                        {/* Semester Filter */}
                        <div>
                            <label className="block text-sm font-hand text-slate-700 font-bold mb-1">
                                Semester:
                            </label>
                            <select
                                value={filters.semester || ""}
                                onChange={(e) => updateFilter("semester", e.target.value as ResourceFilters["semester"])}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-sans text-sm focus:outline-none focus:border-blue-500 shadow-sm capitalize"
                            >
                                <option value="">All Semesters</option>
                                <option value="fall">Fall</option>
                                <option value="spring">Spring</option>
                                <option value="summer">Summer</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-hand text-slate-700 font-bold mb-1">
                                Sort By:
                            </label>
                            <select
                                value={filters.sortBy || "newest"}
                                onChange={(e) => updateFilter("sortBy", e.target.value as ResourceFilters["sortBy"])}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-sans text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular (Downloads)</option>
                                <option value="votes">Highest Voted</option>
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-hand text-slate-700 font-bold mb-1">
                                Year:
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 2025"
                                value={filters.year || ""}
                                onChange={(e) => updateFilter("year", e.target.value ? Number(e.target.value) : "")}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-sans text-sm focus:outline-none focus:border-blue-500 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Indicator */}
                <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-hand text-xl text-slate-700 font-bold">
                        Found {pagination.total} note{pagination.total === 1 ? "" : "s"}
                    </span>
                    {loading && <span className="text-sm font-semibold text-blue-600 animate-pulse">Searching Nest...</span>}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="w-full text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-center font-semibold mb-6">
                        {error}
                    </div>
                )}

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
                    {!loading && resources.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white/60 border border-slate-300 rounded-2xl p-8">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="font-hand text-2xl text-slate-700 font-bold">No matching notes found.</p>
                            <p className="font-hand text-lg text-slate-500 mt-1">Try clearing your filters or typing different search terms.</p>
                        </div>
                    ) : (
                        resources.map((resItem) => {
                            const myVote = userVotes[resItem._id] || 0;
                            const totalVoteScore = resItem.voteScore + myVote;

                            return (
                                <div key={resItem._id} className="relative p-6 flex flex-col justify-between min-h-[260px] shadow-sm hover:shadow-md transition-shadow">
                                    <RoughCardBackground fillColor="#fdfaf6" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${resItem.type === "midterm" ? "bg-amber-100 text-amber-800 border border-amber-300" : resItem.type === "final" ? "bg-red-100 text-red-800 border border-red-300" : "bg-purple-100 text-purple-800 border border-purple-300"}`}>
                                                {resItem.type}
                                            </span>
                                            <span className="font-hand text-sm text-slate-600">
                                                {resItem.semester.toUpperCase()} {resItem.year}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-800 font-sans leading-snug mb-2">
                                            {resItem.title}
                                        </h3>

                                        {resItem.lesson && (
                                            <div className="inline-block bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-md text-xs font-semibold mb-3">
                                                {resItem.lesson.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10 pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
                                        {/* Voting & Metadata */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
                                                <button
                                                    onClick={() => handleVote(resItem._id, 1)}
                                                    className={`hover:text-blue-600 transition-colors ${myVote === 1 ? "text-blue-600" : ""}`}
                                                    title="Upvote"
                                                >
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                </button>
                                                <span>{totalVoteScore}</span>
                                                <button
                                                    onClick={() => handleVote(resItem._id, -1)}
                                                    className={`hover:text-red-600 transition-colors ${myVote === -1 ? "text-red-600" : ""}`}
                                                    title="Downvote"
                                                >
                                                    <ThumbsDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{resItem.views || 0}</span>
                                            </div>
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={() => handleDownload(resItem)}
                                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => updateFilter("page", pagination.page - 1)}
                            className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-300 rounded-full text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="font-hand text-lg text-slate-700 font-bold">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => updateFilter("page", pagination.page + 1)}
                            className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-300 rounded-full text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
