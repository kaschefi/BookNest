"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import rough from "roughjs";
import Navbar from "@/components/layout/Navbar";
import { useUploadForm } from "@/hooks/useUploadForm";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useLanguage } from "@/context/LanguageContext";

function RoughTabBackground() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const draw = () => {
            if (!svgRef.current) return;
            svgRef.current.innerHTML = "";
            const rc = rough.svg(svgRef.current);
            const parent = svgRef.current.parentElement;
            const w = parent ? parent.offsetWidth : 180;
            const h = parent ? parent.offsetHeight : 45;

            const box = rc.rectangle(2, 2, w - 4, h - 4, {
                fill: "rgba(59, 130, 246, 0.18)", // Beautiful soft blue hachure scribble
                stroke: "none",
                fillStyle: "zigzag", // Scribbled pencil effect
                hachureAngle: 65,
                hachureGap: 3.5,
                roughness: 1.8,
                bowing: 1.2
            });

            const outline = rc.rectangle(2, 2, w - 4, h - 4, {
                fill: "none",
                stroke: "#2563eb", // Solid blue ink border
                strokeWidth: 1.5,
                roughness: 1.2,
                bowing: 1.0
            });

            svgRef.current.appendChild(box);
            svgRef.current.appendChild(outline);
        };

        draw();
        window.addEventListener("resize", draw);
        return () => window.removeEventListener("resize", draw);
    }, []);

    return (
        <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
    );
}

export default function NotesUploadPage() {
    const { isLoggedIn, status } = useAuthStatus();
    const { t } = useLanguage();
    const {
        title,
        setTitle,
        fieldQuery,
        setFieldQuery,
        lessonQuery,
        setLessonQuery,
        resourceType,
        setResourceType,
        semester,
        setSemester,
        year,
        setYear,
        YEARS,
        SEMESTERS,
        file,
        fieldDropdownOpen,
        setFieldDropdownOpen,
        lessonDropdownOpen,
        setLessonDropdownOpen,
        dragging,
        uploading,
        error,
        success,
        filteredFields,
        filteredLessons,
        selectField,
        selectLesson,
        handleFieldBlur,
        handleLessonBlur,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileChange,
        handleCancel,
        handleSubmit
    } = useUploadForm();

    if (status === "loading") {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden p-8 bg-[#fdfaf6]">
                {/* Red margin lines */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
                <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

                {/* Wobbly Card Loader */}
                <div className="w-full max-w-sm bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-xl flex flex-col items-center text-center">
                    {/* Wiggling pencil */}
                    <div className="animate-bounce mb-4 text-[#5b73b5]">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-slate-800 uppercase tracking-wider">{t("notesUpload.loadingTitle")}</h3>
                    <p className="font-hand text-[19px] text-slate-600 mt-2">{t("notesUpload.loadingSubtitle")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12">
            {/* Overlay if not logged in */}
            {!isLoggedIn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    {/* Lined index card for the modal */}
                    <div className="relative bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-2xl max-w-md w-full mx-auto text-left overflow-hidden flex flex-col">
                        {/* Torn tape header effect */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#5b73b5]/90 text-white text-xs font-bold px-6 py-1.5 shadow-sm rounded-b-md select-none font-sans uppercase tracking-wider">
                            {t("notesUpload.attentionTitle")}
                        </div>

                        {/* Card lines background */}
                        <div className="mt-4 pl-6 relative border-l-2 border-red-400/70">
                            {/* Padlock Icon (Cute hand-drawn SVG) */}
                            <div className="text-indigo-900/80 mb-4 hover:scale-110 transition-transform duration-300 w-16 h-16">
                                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Wobbly Shackle */}
                                    <path d="M 30,50 C 30,25 70,25 70,50" />
                                    {/* Wobbly Lock Body */}
                                    <path d="M 20,50 C 35,48 65,48 80,50 C 82,65 82,85 80,90 C 65,92 35,92 20,90 C 18,85 18,65 20,50 Z" fill="#fdfaf6" />
                                    {/* Wobbly Keyhole */}
                                    <circle cx="50" cy="65" r="5" fill="currentColor" />
                                    <path d="M 50,70 L 50,80" />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-extrabold text-[#2a2d64] tracking-tight uppercase mb-2">
                                {t("notesUpload.loginRequiredTitle")}
                            </h2>

                            <p className="font-hand text-[22px] text-slate-700 leading-relaxed mb-6">
                                {t("notesUpload.loginRequiredSubtitle")}
                            </p>

                            {/* CTA Button */}
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full text-base tracking-wide transition-all shadow-md shadow-blue-600/20 active:scale-95 uppercase text-center block w-full"
                                >
                                    {t("notesUpload.goToLogin")}
                                </Link>
                                <Link
                                    href="/"
                                    className="text-slate-500 hover:text-slate-800 text-sm font-semibold underline underline-offset-4 font-hand text-[17px] hover:scale-105 transition-transform text-center block"
                                >
                                    {t("notesUpload.returnHome")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lined Notebook Paper Aesthetics */}
            {/* Left red margin lines */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-6 w-full max-w-[1400px]">
                {/* ----------------- LEFT DOODLES ----------------- */}
                <div className="absolute inset-y-0 left-0 w-[240px] pointer-events-none hidden min-[1200px]:block">
                    {/* Microscope Doodle */}
                    <div className="absolute top-[4%] left-[10%] w-[180px] h-[220px] mix-blend-multiply transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/microscope_doodle.png"
                            alt="Microscope doodle"
                            fill
                            className="object-contain contrast-[1.2] brightness-[1.05] mix-blend-multiply"
                            priority
                        />
                    </div>

                    {/* Pythagoras Formula */}
                    <div className="absolute top-[34%] left-[45%] font-hand text-[26px] text-slate-800 transform -rotate-6 scale-110">
                        <div className="relative inline-block">
                            a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>
                            <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] opacity-90 mix-blend-multiply">
                                <Image
                                    src="/formula_underline.png"
                                    alt="Formula Underline"
                                    fill
                                    className="object-contain mix-blend-multiply"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>

                    {/* Wobbly Ellipse Coordinate Graph */}
                    <div className="absolute top-[52%] left-[4%] transform rotate-6 scale-90 text-slate-700">
                        <svg width="180" height="150" viewBox="0 0 180 150" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {/* X and Y Axes */}
                            <path d="M15 75 L165 75 M90 10 L90 140" strokeDasharray="3,3" />
                            <path d="M160 70 L165 75 L160 80 M85 15 L90 10 L95 15" />
                            {/* Wobbly Ellipse */}
                            <path d="M 90, 30 C 135,32 155,50 155,75 C 155,100 135,118 90,120 C 45,118 25,100 25,75 C 25,50 45,32 90,30 Z" />
                            {/* Focus points */}
                            <circle cx="50" cy="75" r="2.5" fill="currentColor" />
                            <circle cx="130" cy="75" r="2.5" fill="currentColor" />
                            {/* Labels */}
                            <text x="45" y="92" className="font-hand text-[17px] fill-current">f₀</text>
                            <text x="125" y="92" className="font-hand text-[17px] fill-current">f₂</text>
                            <text x="98" y="24" className="font-hand text-[17px] fill-current">y</text>
                            <text x="98" y="54" className="font-hand text-[17px] fill-current">h</text>
                            <text x="160" y="92" className="font-hand text-[17px] fill-current">x</text>
                            {/* Dimension Line for h */}
                            <path d="M85 45 L95 45" />
                        </svg>
                    </div>

                    {/* Pythagoras Right Triangle */}
                    <div className="absolute top-[75%] left-[65%] transform -rotate-12 scale-90 flex flex-col items-center">
                        <div className="relative text-slate-800">
                            <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 70 L90 70 L10 10 Z" />
                                <rect x="10" y="60" width="10" height="10" />
                            </svg>
                            <span className="absolute top-[40%] -left-4 font-hand text-xl">a</span>
                            <span className="absolute bottom-[-22px] left-[40%] font-hand text-xl">b</span>
                            <span className="absolute top-[25%] left-[60%] font-hand text-xl">c</span>
                        </div>
                    </div>
                </div>

                {/* ----------------- RIGHT DOODLES ----------------- */}
                <div className="absolute inset-y-0 right-0 w-[240px] pointer-events-none hidden min-[1200px]:block">
                    {/* Caffeine Molecule Doodle */}
                    <div className="absolute top-[2%] right-[10%] w-[150px] h-[150px] mix-blend-multiply transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/Para-Cresol.png"
                            alt="Caffeine molecule structure"
                            fill
                            className="object-contain contrast-[1.1] brightness-[1.02] mix-blend-multiply"
                        />
                    </div>

                    {/* Sliding Force Block Doodle */}
                    <div className="absolute top-[26%] right-[5%] w-[160px] h-[80px] scale-120 mix-blend-multiply transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/Force_Block.png"
                            alt="Force Block"
                            fill
                            className="object-contain contrast-[1.1] brightness-[1.1]"
                        />
                    </div>

                    {/* Magnifying Glass Doodle */}
                    <div className="absolute top-[40%] right-[10%] w-[130px] h-[130px] mix-blend-multiply transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/magnifying_glass_doodle_1.png"
                            alt="Magnifying glass doodle"
                            fill
                            className="object-contain contrast-[1.2] brightness-[1.05] mix-blend-multiply"
                        />
                    </div>

                    {/* Quadratic Equation */}
                    <div className="absolute top-[62%] right-[18%] font-hand text-[22px] text-slate-800 transform rotate-2 flex items-center gap-2 scale-110">
                        <span>X =</span>
                        <div className="flex flex-col items-center">
                            <span className="border-b border-slate-800 px-2">-b ± √<span className="border-t border-slate-800">b<sup>2</sup> - 4ac</span></span>
                            <span>2a</span>
                        </div>
                    </div>

                    {/* Combined Study Books Doodle */}
                    <div className="absolute bottom-[2%] right-[10%] w-[160px] h-[130px] mix-blend-multiply transition-transform hover:-translate-y-1 duration-300">
                        <Image
                            src="/combined_books.PNG"
                            alt="Study books illustration"
                            fill
                            className="object-contain contrast-[1.1] brightness-[1.05] mix-blend-multiply"
                        />
                    </div>
                </div>

                {/* ----------------- CENTERED MAIN UPLOAD FORM ----------------- */}
                <div className="relative w-full max-w-[620px] flex flex-col items-center mt-4 mb-8">
                    {/* Header Atom Icon */}
                    <div className="text-indigo-900 mb-2 hover:scale-110 transition-transform duration-500 cursor-pointer">
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(30 50 50)" />
                            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(90 50 50)" />
                            <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(150 50 50)" />
                            <circle cx="50" cy="50" r="6" fill="currentColor" />
                            <circle cx="85" cy="70" r="4.5" fill="#3b82f6" stroke="none" />
                            <circle cx="15" cy="30" r="4.5" fill="#3b82f6" stroke="none" />
                            <circle cx="70" cy="15" r="4.5" fill="#3b82f6" stroke="none" />
                        </svg>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight text-center select-none uppercase font-sans">
                        {t("notesUpload.pageTitle")}
                    </h1>

                    {/* Handwriting Subtitle */}
                    <p className="font-hand text-[22px] text-slate-700 font-medium text-center mt-1 mb-6 max-w-[450px]">
                        {t("notesUpload.pageSubtitle")}
                    </p>

                    {/* Main Container Card */}
                    <div className="w-full bg-[#fdfaf6] border border-slate-400 p-6 md:p-8 rounded-[16px] shadow-xl flex flex-col">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Document Title Input */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("notesUpload.documentTitleLabel")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t("notesUpload.documentTitlePlaceholder")}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3.5 rtl:pr-0 rtl:pl-3.5 flex items-center pointer-events-none text-blue-500/80">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Field of Study Input (Autocomplete) */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("notesUpload.fieldOfStudyLabel")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t("notesUpload.fieldOfStudyPlaceholder")}
                                        value={fieldQuery}
                                        onChange={(e) => {
                                            setFieldQuery(e.target.value);
                                            setFieldDropdownOpen(true);
                                        }}
                                        onFocus={() => setFieldDropdownOpen(true)}
                                        onBlur={handleFieldBlur}
                                        className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                    {fieldDropdownOpen && filteredFields.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-[#fdfaf6] border border-slate-400 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredFields.map((field) => (
                                                <div
                                                    key={field._id}
                                                    onMouseDown={() => selectField(field)}
                                                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-slate-800 text-sm border-b border-slate-100 last:border-0 transition-colors"
                                                >
                                                    {field.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lesson / Topic Input (Autocomplete) */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("notesUpload.lessonTopicLabel")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t("notesUpload.lessonTopicPlaceholder")}
                                        value={lessonQuery}
                                        onChange={(e) => {
                                            setLessonQuery(e.target.value);
                                            setLessonDropdownOpen(true);
                                        }}
                                        onFocus={() => setLessonDropdownOpen(true)}
                                        onBlur={handleLessonBlur}
                                        className="w-full pl-4 pr-10 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3.5 rtl:pr-0 rtl:pl-3.5 flex items-center pointer-events-none text-slate-500/80">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {lessonDropdownOpen && filteredLessons.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-[#fdfaf6] border border-slate-400 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredLessons.map((lesson) => (
                                                <div
                                                    key={lesson._id}
                                                    onMouseDown={() => selectLesson(lesson)}
                                                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-slate-800 text-sm border-b border-slate-100 last:border-0 transition-colors"
                                                >
                                                    {lesson.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Semester and Year Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                        {t("notesUpload.semesterLabel")}
                                    </label>
                                    <select
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value as "fall" | "spring" | "summer")}
                                        className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm capitalize"
                                    >
                                        {SEMESTERS.map((s) => (
                                            <option key={s} value={s}>
                                                {t(`notesUpload.semesters.${s}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                        {t("notesUpload.yearLabel")}
                                    </label>
                                    <input
                                        type="number"
                                        min="1900"
                                        max="2099"
                                        placeholder={t("notesUpload.yearPlaceholder")}
                                        value={year || ""}
                                        onChange={(e) => setYear(e.target.value ? Number(e.target.value) : 0)}
                                        className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Type Tabs Selection */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("notesUpload.typeLabel")}
                                </label>
                                <div className="flex border border-slate-400 rounded-lg overflow-hidden bg-[#fdfaf6] shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setResourceType("midterm")}
                                        className={`relative flex-1 py-2.5 text-center text-[18px] font-hand font-bold transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${resourceType === "midterm" ? "text-blue-900" : "hover:bg-slate-50/50 text-slate-500"}`}
                                    >
                                        {resourceType === "midterm" && <RoughTabBackground />}
                                        <span className="relative z-10">{t("notesUpload.midterm")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResourceType("final")}
                                        className={`relative flex-1 py-2.5 text-center text-[18px] font-hand font-bold transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${resourceType === "final" ? "text-blue-900" : "hover:bg-slate-50/50 text-slate-500"}`}
                                    >
                                        {resourceType === "final" && <RoughTabBackground />}
                                        <span className="relative z-10">{t("notesUpload.final")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResourceType("pamphlet")}
                                        className={`relative flex-1 py-2.5 text-center text-[18px] font-hand font-bold transition-all overflow-hidden border-r border-slate-400 rtl:border-r-0 rtl:border-l last:border-0 ${resourceType === "pamphlet" ? "text-blue-900" : "hover:bg-slate-50/50 text-slate-500"}`}
                                    >
                                        {resourceType === "pamphlet" && <RoughTabBackground />}
                                        <span className="relative z-10">{t("notesUpload.extra")}</span>
                                    </button>
                                </div>
                            </div>

                            {/* File Upload Drag & Drop Area */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("notesUpload.fileLabel")}
                                </label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-lg p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${dragging ? "border-blue-500 bg-blue-50/40 scale-[1.01]" : "border-slate-400 bg-transparent hover:bg-slate-50/50"}`}
                                    onClick={() => document.getElementById("file-input")?.click()}
                                >
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept=".pdf,.docx,.txt"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    <p className="font-hand text-[19px] text-slate-700 font-medium text-center max-w-[340px]">
                                        {file ? (
                                            <span className="text-blue-600 font-bold bg-blue-50/80 px-2 py-1 rounded border border-blue-200 inline-block transform -rotate-1 shadow-sm">
                                                {t("notesUpload.fileSelected")}: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        ) : (
                                            t("notesUpload.fileDropPrompt")
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Notifications / Errors */}
                            {error && (
                                <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-2.5 rounded-lg border border-red-200 transform rotate-[-0.5deg]">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-700 text-sm font-semibold text-center bg-green-50 p-2.5 rounded-lg border border-green-200 transform rotate-[0.5deg]">
                                    {success}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col items-center gap-3 pt-3">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-3 rounded-full text-base tracking-wide transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed uppercase"
                                >
                                    {uploading ? t("notesUpload.uploadingButton") : t("notesUpload.uploadButton")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="text-slate-500 hover:text-slate-800 text-sm font-semibold underline underline-offset-4 font-hand text-[17px] hover:scale-105 transition-transform"
                                >
                                    {t("notesUpload.cancelButton")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
