"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useBooksPage, Book } from "@/hooks/useBooksPage";
import { BookOpen, Search, Download, Star } from "lucide-react";

export default function BooksPage() {
    const {
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        subjects,
        books
    } = useBooksPage();

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
            {/* Lined Notebook Margins */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-6 w-full max-w-[1200px]">
                {/* Header Title */}
                <div className="text-center mb-8">
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight uppercase font-sans">
                            BookNest Library
                        </h1>
                    </div>
                    <p className="font-hand text-[22px] text-slate-700 font-medium text-center mt-3">
                        Essential textbooks, reference guides, and curated study materials.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Subject Pill Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-full font-hand text-lg transition-all ${
                                    selectedSubject === subject
                                        ? "bg-indigo-600 text-white shadow-md scale-105"
                                        : "bg-white/80 border border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full max-w-[360px]">
                        <div className="relative flex items-center bg-[#fdfaf6] border border-slate-400 rounded-lg shadow-sm focus-within:border-blue-500 overflow-hidden">
                            <Search className="w-5 h-5 ml-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search books by title or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2.5 bg-transparent text-slate-800 font-sans text-sm focus:outline-none placeholder-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {books.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="font-hand text-2xl text-slate-600 font-bold">No books found.</p>
                            <p className="font-hand text-lg text-slate-500 mt-1">Try adjusting your subject filter or search terms.</p>
                        </div>
                    ) : (
                        books.map((book: Book) => (
                            <div key={book.id} className="relative p-6 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md transition-shadow">
                                <RoughCardBackground fillColor="#fdfaf6" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-hand text-sm px-2.5 py-0.5 rounded-full border border-slate-300 text-slate-700 bg-white">
                                            {book.subject}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span>{book.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 font-sans leading-snug mb-1">
                                        {book.title}
                                    </h3>
                                    <p className="font-hand text-base text-indigo-700 font-semibold mb-3">
                                        by {book.author}
                                    </p>
                                    <p className="font-hand text-slate-600 text-base leading-relaxed">
                                        {book.description}
                                    </p>
                                </div>

                                <div className="relative z-10 pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                                    <span className="font-hand text-xs text-slate-500">Verified Study Textbook</span>
                                    <button
                                        onClick={() => alert(`Downloading "${book.title}"...`)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-sans text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
