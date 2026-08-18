"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useSubjectLessons, IResource } from "@/hooks/useSubjectLessons";
import { useLanguage } from "@/context/LanguageContext";

// Realistic binder coils component for notebook look
export function NotebookSpiral() {
    return (
        <div className="absolute left-2 top-0 bottom-0 w-12 flex flex-col justify-between py-12 pointer-events-none z-30">
            {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="relative flex items-center h-8 my-2">
                    {/* Realistic metal ring binding */}
                    <svg className="absolute -left-6 w-16 h-8 text-slate-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] filter" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M 4 16 C 12 2, 48 2, 52 16 C 52 22, 46 28, 32 28" strokeLinecap="round" />
                        <path d="M 12 10 C 18 4, 42 4, 46 12" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
                    </svg>
                    {/* Hole punched in paper */}
                    <div className="absolute left-6 w-3.5 h-3.5 bg-slate-900 rounded-full border border-slate-700 shadow-inner flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SubjectLessonsPage() {
    const { t, isRTL } = useLanguage();
    const {
        subjectSlug,
        fieldName,
        loading,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedLessons,
        filteredLessons,
        startIndex,
        lessonsPerPage,
        selectedLesson,
        setSelectedLesson,
        resources,
        loadingResources,
        activeTab,
        setActiveTab,
        userVotes,
        handleDownload,
        handleVote,
        activeStatic,
    } = useSubjectLessons();

    // Map title if preset subject
    const subjectTitleMap: Record<string, string> = {
        "mathematics": t("subjectsSection.mathematics"),
        "computer-science": t("subjectsSection.computerScience").replace("\n", " "),
        "chemistry": t("subjectsSection.chemistry"),
        "physics": t("subjectsSection.physics"),
    };
    const displayName = subjectTitleMap[subjectSlug] || fieldName || activeStatic.name;

    // Tabbed resources
    const midterms = resources.filter((r) => r.type === "midterm");
    const finals = resources.filter((r) => r.type === "final");
    const pamphlets = resources.filter((r) => r.type === "pamphlet");

    const getActiveTabList = () => {
        if (activeTab === "midterm") return midterms;
        if (activeTab === "final") return finals;
        return pamphlets;
    };

    const currentTabResources = getActiveTabList();

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
            {/* Lined Notebook Paper Aesthetics */}
            {/* Red margins */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            {/* Notebook Spiral Coils Sidebar */}
            <NotebookSpiral />

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-6 w-full max-w-[1400px] pl-6 md:pl-16">
                
                {/* ================= MARGIN DOODLES (LEFT SIDE) ================= */}
                <div dir="ltr" className="absolute inset-y-0 left-0 w-[240px] pointer-events-none hidden min-[1250px]:block">
                    {subjectSlug === "mathematics" && (
                        <>
                            {/* Laptop */}
                            <div className="absolute top-[2%] left-[10%] w-[160px] h-[160px] mix-blend-multiply transition-transform hover:scale-105 duration-300">
                                <Image src="/new_laptop.png" alt="Laptop" fill className="object-contain grayscale contrast-[1.2] brightness-[1.1]" />
                            </div>
                            {/* Binary numbers */}
                            <div className="absolute top-[16%] left-[45%] font-hand text-[20px] text-slate-800/80 leading-none rotate-2">
                                010101<br />101010
                            </div>
                            {/* Beaker */}
                            <div className="absolute top-[32%] left-[8%] w-[120px] h-[120px] mix-blend-multiply transition-transform hover:rotate-6 duration-300">
                                <Image src="/Flask.png" alt="Beaker" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            {/* Molecule structure outline */}
                            <div className="absolute top-[52%] left-[10%] w-[110px] h-[110px] mix-blend-multiply">
                                <Image src="/Molecular_Model.png" alt="Molecule structure" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            {/* Math formulas */}
                            <div className="absolute top-[70%] left-[15%] font-hand text-[26px] text-slate-800/90 -rotate-6" dir="ltr">
                                F = ma
                            </div>
                            {/* Star */}
                            <div className="absolute top-[82%] left-[25%] w-[50px] h-[50px] mix-blend-multiply opacity-80">
                                <Image src="/Star.png" alt="Star outline" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                        </>
                    )}

                    {subjectSlug === "computer-science" && (
                        <>
                            <div className="absolute top-[2%] left-[10%] w-[160px] h-[160px] mix-blend-multiply">
                                <Image src="/new_laptop.png" alt="Laptop" fill className="object-contain grayscale contrast-[1.2] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[16%] left-[45%] font-hand text-[19px] text-slate-700/80 leading-none -rotate-6">
                                void main() &#123;<br />&nbsp;&nbsp;printf(&quot;nest&quot;);<br />&#125;
                            </div>
                            <div className="absolute top-[34%] left-[15%] text-slate-600">
                                <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="25" y="5" width="70" height="24" rx="4" />
                                    <rect x="5" y="50" width="45" height="24" rx="4" />
                                    <rect x="70" y="50" width="45" height="24" rx="4" />
                                    <path d="M 60 29 L 60 40 L 27 40 L 27 50 M 60 40 L 92 40 L 92 50" />
                                    <text x="35" y="21" className="font-hand text-[14px] fill-current font-bold">Start</text>
                                    <text x="13" y="66" className="font-hand text-[14px] fill-current">Code</text>
                                    <text x="80" y="66" className="font-hand text-[14px] fill-current">Debug</text>
                                </svg>
                            </div>
                            <div className="absolute top-[56%] left-[10%] w-[120px] h-[120px] mix-blend-multiply">
                                <Image src="/Flask.png" alt="Science Beaker" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[75%] left-[20%] font-hand text-[22px] text-slate-800 -rotate-3" dir="ltr">
                                binary_search()
                            </div>
                        </>
                    )}

                    {(subjectSlug !== "mathematics" && subjectSlug !== "computer-science") && (
                        <>
                            {/* Generic fallback doodles */}
                            <div className="absolute top-[4%] left-[12%] w-[140px] h-[140px] mix-blend-multiply">
                                <Image src="/Flask.png" alt="Flask fallback" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[36%] left-[15%] w-[120px] h-[120px] mix-blend-multiply">
                                <Image src="/Molecular_Model.png" alt="Molecule fallback" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[68%] left-[20%] font-hand text-[24px] text-slate-800 -rotate-6" dir="ltr">
                                H₂O + CO₂ → C₆H₁₂O₆
                            </div>
                        </>
                    )}
                </div>

                {/* ================= MARGIN DOODLES (RIGHT SIDE) ================= */}
                <div dir="ltr" className="absolute inset-y-0 right-0 w-[240px] pointer-events-none hidden min-[1250px]:block">
                    {subjectSlug === "mathematics" && (
                        <>
                            {/* Pythagorean Right Triangle */}
                            <div className="absolute top-[2%] right-[25%] transform rotate-12 scale-90">
                                <div className="relative text-slate-700">
                                    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M 15 75 L 105 75 L 15 15 Z" />
                                        <rect x="15" y="65" width="10" height="10" />
                                    </svg>
                                    <span className="absolute top-[40%] left-[-4px] font-hand text-[19px]">a</span>
                                    <span className="absolute bottom-[-18px] left-[50%] font-hand text-[19px]">b</span>
                                    <span className="absolute top-[30%] left-[55%] font-hand text-[19px]">c</span>
                                </div>
                            </div>
                            <div className="absolute top-[15%] right-[20%] font-hand text-[23px] text-slate-800 rotate-6">
                                a² + b² = c²
                            </div>
                            {/* Calculator */}
                            <div className="absolute top-[28%] right-[10%] w-[120px] h-[130px] mix-blend-multiply transition-transform hover:-translate-y-1.5 duration-300">
                                <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-slate-700 bg-[#fdfaf6] p-1.5 rounded border border-slate-300 shadow-sm">
                                    <rect x="5" y="5" width="90" height="110" rx="6" />
                                    <rect x="12" y="12" width="76" height="24" rx="3" fill="#e2e8f0" stroke="none" />
                                    <text x="18" y="29" className="font-hand text-[17px] fill-current tracking-wider">123.456</text>
                                    {/* Buttons */}
                                    <path d="M15 50 h15 M42 50 h15 M70 50 h15" />
                                    <path d="M15 70 h15 M42 70 h15 M70 70 h15" />
                                    <path d="M15 90 h15 M42 90 h15 M70 90 h15" />
                                </svg>
                            </div>
                            {/* Formula */}
                            <div className="absolute top-[48%] right-[25%] font-hand text-[24px] text-slate-800 rotate-3">
                                E = mc²
                            </div>
                            {/* Chemical ring hexagon */}
                            <div className="absolute top-[60%] right-[12%] text-slate-700">
                                <svg width="140" height="120" viewBox="0 0 140 120" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polygon points="50,15 90,15 110,50 90,85 50,85 30,50" />
                                    <line x1="53" y1="20" x2="87" y2="20" />
                                    <line x1="102" y1="50" x2="87" y2="78" />
                                    <line x1="48" y1="78" x2="35" y2="50" />
                                    {/* Sub bonds */}
                                    <path d="M 90 85 L 105 102 M 50 85 L 35 102 M 30 50 L 10 50" />
                                    <text x="106" y="112" className="font-hand text-[15px] fill-current">OH</text>
                                    <text x="20" y="112" className="font-hand text-[15px] fill-current">CH₃</text>
                                    <text x="0" y="55" className="font-hand text-[15px] fill-current">H</text>
                                </svg>
                            </div>
                            {/* Floating Star */}
                            <div className="absolute top-[82%] right-[32%] w-[45px] h-[45px] opacity-70 mix-blend-multiply">
                                <Image src="/Star.png" alt="Star outline" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            {/* Planet */}
                            <div className="absolute top-[88%] right-[8%] text-slate-600 scale-90">
                                <svg width="90" height="60" viewBox="0 0 90 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    {/* Saturn-like Planet ring */}
                                    <ellipse cx="45" cy="30" rx="38" ry="10" transform="rotate(-15 45 30)" />
                                    <circle cx="45" cy="30" r="18" fill="#fdfaf6" stroke="currentColor" strokeWidth="1.8" />
                                    {/* Front ring cover */}
                                    <path d="M 12 36 C 25 43, 65 43, 78 36" />
                                </svg>
                            </div>
                        </>
                    )}

                    {subjectSlug === "computer-science" && (
                        <>
                            <div className="absolute top-[4%] right-[15%] text-slate-700">
                                <svg width="110" height="110" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    {/* CPU block */}
                                    <rect x="20" y="20" width="60" height="60" rx="6" />
                                    <rect x="35" y="35" width="30" height="30" rx="3" fill="#e2e8f0" stroke="none" />
                                    <text x="42" y="54" className="font-hand text-[14px] fill-current font-bold">CPU</text>
                                    {/* Pins */}
                                    <path d="M10 30h10 M10 50h10 M10 70h10 M90 30h-10 M90 50h-10 M90 70h-10 M30 10v10 M50 10v10 M70 10v10 M30 90v-10 M50 90v-10 M70 90v-10" />
                                </svg>
                            </div>
                            <div className="absolute top-[26%] right-[22%] font-hand text-[23px] text-slate-800 rotate-6">
                                O(n log n)
                            </div>
                            <div className="absolute top-[42%] right-[10%] w-[120px] h-[120px] mix-blend-multiply">
                                <Image src="/sine_graph.png" alt="Grid Graph" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[64%] right-[15%] text-slate-700">
                                <svg width="100" height="90" viewBox="0 0 100 90" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    {/* Database cylinder stack */}
                                    <ellipse cx="50" cy="20" rx="30" ry="10" />
                                    <path d="M 20 20 L 20 45 A 30 10 0 0 0 80 45 L 80 20" />
                                    <path d="M 20 45 L 20 70 A 30 10 0 0 0 80 70 L 80 45" />
                                    <text x="35" y="50" className="font-hand text-[16px] fill-current">DB SQL</text>
                                </svg>
                            </div>
                            <div className="absolute top-[82%] right-[25%] font-hand text-[20px] text-slate-800 rotate-3">
                                &#60;StudyNest /&#62;
                            </div>
                        </>
                    )}

                    {(subjectSlug !== "mathematics" && subjectSlug !== "computer-science") && (
                        <>
                            <div className="absolute top-[4%] right-[12%] w-[150px] h-[150px] mix-blend-multiply">
                                <Image src="/sine_graph.png" alt="Sine Graph Fallback" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[32%] right-[20%] font-hand text-[24px] text-slate-800 rotate-6">
                                PV = nRT
                            </div>
                            <div className="absolute top-[48%] right-[10%] w-[130px] h-[70px] mix-blend-multiply">
                                <Image src="/Force_Block.png" alt="Force Block Fallback" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                            </div>
                            <div className="absolute top-[68%] right-[15%] text-slate-700">
                                <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <ellipse cx="60" cy="45" rx="45" ry="15" transform="rotate(-30 60 45)" />
                                    <circle cx="60" cy="45" r="10" fill="#e2e8f0" stroke="currentColor" strokeWidth="1.8" />
                                    <text x="52" y="50" className="font-hand text-[16px] fill-current font-bold">Orbit</text>
                                </svg>
                            </div>
                        </>
                    )}
                </div>

                {/* ================= PAGE TITLE SECTION ================= */}
                <div className="text-center mb-6">
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight uppercase select-none font-sans">
                            {displayName}
                        </h1>
                        <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] opacity-90 mix-blend-multiply">
                            <Image src="/title_underline.png" alt="Underline" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                        </div>
                    </div>
                    <p className="font-hand text-[22px] text-slate-700 font-medium text-center mt-4">
                        {activeStatic.subtitle}
                    </p>
                </div>

                {/* ================= SEARCH BAR ================= */}
                <div className="relative w-full max-w-[550px] mb-8 mt-2 px-4 md:px-0">
                    <div className="relative flex items-center bg-[#fdfaf6] border border-slate-400 rounded-lg shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden transition-all">
                        {/* Search Icon */}
                        <div className="pl-4 pr-2 rtl:pr-4 rtl:pl-2 text-slate-500 flex justify-center items-center pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={t("subjects.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-4 py-2.5 bg-transparent border-0 text-slate-800 font-sans focus:outline-none placeholder-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="pr-4 pl-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* ================= LESSONS CONTAINER ================= */}
                <div className="w-full max-w-[620px] min-h-[580px] relative px-4 md:px-0 mb-6">
                    <div className="relative w-full flex flex-col p-6 md:p-8 min-h-[560px]">
                        <RoughCardBackground />

                        {loading ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-12">
                                <div className="animate-bounce mb-3 text-[#5b73b5]">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <p className="font-hand text-[20px] text-slate-600">{t("subjects.loadingLessons")}</p>
                            </div>
                        ) : filteredLessons.length === 0 ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                                <p className="font-hand text-[23px] text-slate-600 font-bold">{t("subjects.noLessonsFound")}</p>
                                <p className="font-hand text-lg text-slate-500 mt-1 max-w-[280px]">{t("subjects.noLessonsHint")}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full divide-y divide-slate-200 z-10">
                                {paginatedLessons.map((lesson) => (
                                    <div
                                        key={lesson.index}
                                        onClick={() => setSelectedLesson(lesson)}
                                        className="group/item flex items-center justify-between py-5 cursor-pointer hover:bg-slate-50/55 rounded-lg px-2 -mx-2 transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Index Circle Indicator */}
                                            <div className="w-9 h-9 min-w-9 rounded-full border-1.5 border-slate-600 bg-white flex items-center justify-center font-hand text-[19px] font-bold text-slate-700 shadow-sm transform group-hover/item:rotate-[-6deg] group-hover/item:scale-105 transition-all">
                                                {lesson.index}
                                            </div>

                                            {/* Lesson Metadata */}
                                            <div className="flex flex-col">
                                                <h4 className="font-sans text-[18px] font-bold text-slate-800 leading-snug group-hover/item:text-blue-700 transition-colors">
                                                    {lesson.name}
                                                </h4>
                                                <p className="font-hand text-[17px] text-slate-500 leading-tight mt-0.5 max-w-[430px] font-medium">
                                                    {lesson.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Chevron arrow */}
                                        <div className="text-slate-400 group-hover/item:text-blue-600 group-hover/item:translate-x-1.5 rtl:group-hover/item:-translate-x-1.5 rtl:rotate-180 transition-all duration-200 pr-1 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= PAGINATION CONTROLS ================= */}
                {!loading && totalPages > 1 && (
                    <div className="flex flex-col items-center gap-2 mt-2 mb-8 z-10 select-none">
                        {/* Page Numbers Row */}
                        <div className="flex items-center justify-center gap-4">
                            {/* Prev button */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center font-hand text-lg font-bold text-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage > 1 ? 'hover:border-blue-600 hover:text-blue-600 cursor-pointer' : ''}`}
                            >
                                {isRTL ? "►" : "◄"}
                            </button>

                            {/* Number buttons */}
                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`relative font-hand text-2xl font-bold px-3.5 py-1 text-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer`}
                                    >
                                        {currentPage === pageNum && (
                                            <svg className="absolute inset-0 w-full h-full text-blue-500 pointer-events-none" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                {/* Sketchy hand-drawn circle overlay */}
                                                <path d="M 20 4 C 29 5, 36 12, 35 20 C 34 28, 26 35, 18 35 C 10 35, 4 28, 5 20 C 6 12, 11 3, 22 4" strokeLinecap="round" />
                                            </svg>
                                        )}
                                        <span className="relative z-10">{pageNum}</span>
                                    </button>
                                );
                            })}

                            {/* Next button */}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center font-hand text-lg font-bold text-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage < totalPages ? 'hover:border-blue-600 hover:text-blue-600 cursor-pointer' : ''}`}
                            >
                                {isRTL ? "◄" : "►"}
                            </button>
                        </div>
                        
                        {/* Summary caption */}
                        <p className="font-hand text-[17px] text-slate-500 font-semibold italic -mt-1 select-none">
                            {t("subjects.showingLessons")
                                .replace("{start}", String(startIndex + 1))
                                .replace("{end}", String(Math.min(startIndex + lessonsPerPage, filteredLessons.length)))
                                .replace("{total}", String(filteredLessons.length))}
                        </p>
                    </div>
                )}

                {/* ================= HANDWRITTEN FOOTER ================= */}
                <div className="relative text-center mt-4">
                    <p className="font-hand text-[26px] text-slate-800 font-bold select-none relative inline-block">
                        {activeStatic.footerText}
                        <span className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] opacity-90 mix-blend-multiply select-none pointer-events-none">
                            <Image src="/formula_underline.png" alt="Underline" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                        </span>
                    </p>
                </div>
            </main>

            {/* ================= INTERACTIVE DETAILED NOTES DRAWER/MODAL ================= */}
            {selectedLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-[550px] p-6 md:p-8 min-h-[460px] max-h-[85vh] flex flex-col">
                        <RoughCardBackground fillColor="#fdfaf6" />

                        {/* Top corner close button */}
                        <button
                            onClick={() => setSelectedLesson(null)}
                            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 rounded-full border border-slate-400 hover:border-blue-600 hover:text-blue-600 bg-[#fdfaf6] flex items-center justify-center font-bold text-slate-600 transition-colors shadow-sm active:scale-95"
                            aria-label="Close modal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative z-10 flex flex-col flex-1">
                            {/* Header */}
                            <div className="pr-8 rtl:pr-0 rtl:pl-8 mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-hand text-[18px] text-blue-600 font-bold border border-blue-400 bg-blue-50 px-2 py-0.5 rounded transform -rotate-1 shadow-sm">
                                        {t("subjects.lessonBadge")} {selectedLesson.index}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-[#2a2d64] leading-snug">
                                    {selectedLesson.name}
                                </h2>
                                <p className="font-hand text-[17px] text-slate-500 leading-tight mt-1">
                                    {selectedLesson.description}
                                </p>
                            </div>

                            {/* Resource Categories Tabs */}
                            <div className="flex border border-slate-400 rounded-lg overflow-hidden bg-[#fdfaf6] shadow-sm mb-5 text-[17px] font-hand font-bold">
                                <button
                                    onClick={() => setActiveTab("midterm")}
                                    className={`relative flex-1 py-2 text-center transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${activeTab === "midterm" ? "text-blue-900 bg-blue-50/50" : "hover:bg-slate-50/50 text-slate-500"}`}
                                >
                                    <span>{t("subjects.tabMidterms")} ({midterms.length})</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("final")}
                                    className={`relative flex-1 py-2 text-center transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${activeTab === "final" ? "text-blue-900 bg-blue-50/50" : "hover:bg-slate-50/50 text-slate-500"}`}
                                >
                                    <span>{t("subjects.tabFinals")} ({finals.length})</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("pamphlet")}
                                    className={`relative flex-1 py-2 text-center transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${activeTab === "pamphlet" ? "text-blue-900 bg-blue-50/50" : "hover:bg-slate-50/50 text-slate-500"}`}
                                >
                                    <span>{t("subjects.tabExtra")} ({pamphlets.length})</span>
                                </button>
                            </div>

                            {/* Resources list container */}
                            <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
                                {loadingResources ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin mb-3 text-blue-600">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="font-hand text-[19px] text-slate-600">{t("subjects.fetchingSheets")}</p>
                                    </div>
                                ) : currentTabResources.length === 0 ? (
                                    /* Empty State for category */
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <div className="text-slate-400/80 mb-2 w-14 h-14">
                                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <path d="M 20 80 L 20 20 C 35 18, 65 18, 80 20 L 80 80 Z" />
                                                <path d="M 45 35 L 70 35 M 45 50 L 70 50 M 30 65 L 70 65" strokeDasharray="3,3" />
                                                <path d="M 30 35 L 35 35 M 30 50 L 35 50" />
                                            </svg>
                                        </div>
                                        <p className="font-hand text-[19px] text-slate-600 font-bold">{t("subjects.noSheetsUploaded")}</p>
                                        <p className="font-hand text-base text-slate-500 mt-0.5">{t("subjects.beFirstToShare")}</p>
                                        
                                        <Link
                                            href={`/notes?field=${encodeURIComponent(fieldName)}&lesson=${encodeURIComponent(selectedLesson.name)}`}
                                            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-sm font-medium transition-colors shadow-md shadow-blue-600/10 hover:scale-105 active:scale-95 text-center uppercase"
                                        >
                                            {t("subjects.contributeNotesButton")}
                                        </Link>
                                    </div>
                                ) : (
                                    /* Active list of resources */
                                    <div className="space-y-3 pb-2">
                                        {currentTabResources.map((res: IResource) => (
                                            <div
                                                key={res._id}
                                                className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition-colors shadow-sm group/row"
                                            >
                                                {/* Left Details */}
                                                <div className="flex flex-col flex-1 min-w-0 pr-3 rtl:pr-0 rtl:pl-3">
                                                    <h5 className="font-sans text-base font-bold text-slate-800 leading-snug truncate group-hover/row:text-blue-700 transition-colors" title={res.title}>
                                                        {res.title}
                                                    </h5>
                                                    <div className="flex flex-wrap items-center gap-x-2 text-[14px] text-slate-500 font-hand font-medium mt-0.5">
                                                        <span className="capitalize">{t(`notesUpload.semesters.${res.semester}`)} {res.year}</span>
                                                        <span>•</span>
                                                        <span>{res.downloads} {res.downloads !== 1 ? t("subjects.downloadsCountPlural") : t("subjects.downloadsCount")}</span>
                                                        {res.size && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{(res.size / 1024).toFixed(0)} KB</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Actions (Votes + Download) */}
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {/* Up/Down Voting */}
                                                    <div className="flex items-center border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 text-[14px]">
                                                        {/* Upvote */}
                                                        <button
                                                            onClick={() => handleVote(res, 1)}
                                                            className={`hover:scale-110 active:scale-90 p-0.5 transition-transform ${userVotes[res._id] === 1 ? "text-green-600 font-bold" : "text-slate-400 hover:text-green-600"}`}
                                                            aria-label="Upvote"
                                                        >
                                                            ▲
                                                        </button>
                                                        
                                                        {/* Vote Score */}
                                                        <span className={`font-sans font-semibold min-w-6 text-center px-1 leading-none ${res.voteScore > 0 ? "text-green-600" : res.voteScore < 0 ? "text-red-500" : "text-slate-600"}`}>
                                                            {res.voteScore}
                                                        </span>

                                                        {/* Downvote */}
                                                        <button
                                                            onClick={() => handleVote(res, -1)}
                                                            className={`hover:scale-110 active:scale-90 p-0.5 transition-transform ${userVotes[res._id] === -1 ? "text-red-500 font-bold" : "text-slate-400 hover:text-red-500"}`}
                                                            aria-label="Downvote"
                                                        >
                                                            ▼
                                                        </button>
                                                    </div>

                                                    {/* Download trigger */}
                                                    <button
                                                        onClick={() => handleDownload(res)}
                                                        className="p-2 border border-slate-300 rounded-full hover:border-blue-600 hover:text-blue-600 text-slate-500 hover:bg-blue-50/50 transition-all active:scale-90"
                                                        title={t("subjects.downloadTooltip")}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
