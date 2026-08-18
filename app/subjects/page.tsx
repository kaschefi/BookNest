"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import RoughCardBackground from "@/components/RoughCardBackground";
import { useLanguage } from "@/context/LanguageContext";

interface IFieldData {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
}

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

const PRESET_SUBJECTS: Record<string, { icon: React.ReactNode }> = {
    mathematics: {
        icon: (
            <svg className="w-[80px] h-[80px] text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="25" y="20" width="50" height="60" rx="6" />
                <line x1="25" y1="50" x2="75" y2="50" />
                <line x1="50" y1="20" x2="50" y2="80" />
                <path d="M37.5 31 L37.5 39 M33.5 35 L41.5 35" />
                <path d="M58.5 35 L66.5 35" />
                <path d="M34 61 L41 69 M41 61 L34 69" />
                <path d="M58.5 65 L66.5 65 M62.5 59 L62.5 60 M62.5 70 L62.5 71" />
            </svg>
        )
    },
    "computer-science": {
        icon: (
            <div className="relative w-[80px] h-[80px] flex justify-center items-center">
                <Image
                    src="/pc2_transparent_1.png"
                    alt="Computer Science"
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes="80px"
                />
            </div>
        )
    },
    chemistry: {
        icon: (
            <svg className="w-[80px] h-[80px] text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="50" cy="25" rx="8" ry="3" />
                <path d="M42 25 L42 45 L25 75 C20 84 26 90 35 90 L65 90 C74 90 80 84 75 75 L58 45 L58 25" />
                <path d="M32 63 C40 66 60 60 68 63 L73.5 73 C76 78 72 85 65 85 L35 85 C28 85 24 78 26.5 73 Z" fill="#e0e7ff" stroke="none" />
                <path d="M32 63 C40 66 60 60 68 63" stroke="#4f46e5" strokeWidth="1.5" />
                <circle cx="45" cy="78" r="3" fill="white" stroke="none" opacity="0.8" />
                <circle cx="55" cy="72" r="1.5" fill="white" stroke="none" opacity="0.8" />
                <circle cx="48" cy="85" r="1" fill="white" stroke="none" opacity="0.8" />
            </svg>
        )
    },
    physics: {
        icon: (
            <svg className="w-[80px] h-[80px] text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(90 50 50)" />
                <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(150 50 50)" />
                <circle cx="50" cy="50" r="8" fill="#1e40af" stroke="#1e3a8a" />
                <circle cx="50" cy="50" r="3" fill="#60a5fa" stroke="none" />
            </svg>
        )
    }
};

const DEFAULT_ICON = (
    <svg className="w-[80px] h-[80px] text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export default function SubjectsDirectory() {
    const [fields, setFields] = useState<IFieldData[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const res = await fetch("/api/fields");
                if (res.ok) {
                    const data: IFieldData[] = await res.json();
                    if (data && data.length > 0) {
                        setFields(data);
                    } else {
                        // Fallback to default 4
                        setFields([
                            { name: "Mathematics", slug: "mathematics" },
                            { name: "Computer Science", slug: "computer-science" },
                            { name: "Chemistry", slug: "chemistry" },
                            { name: "Physics", slug: "physics" },
                        ]);
                    }
                }
            } catch (err) {
                console.error("Failed to load dynamic fields:", err);
                setFields([
                    { name: "Mathematics", slug: "mathematics" },
                    { name: "Computer Science", slug: "computer-science" },
                    { name: "Chemistry", slug: "chemistry" },
                    { name: "Physics", slug: "physics" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, []);

    const fieldNameMap: Record<string, string> = {
        "mathematics": t("subjectsSection.mathematics"),
        "computer-science": t("subjectsSection.computerScience").replace("\n", " "),
        "chemistry": t("subjectsSection.chemistry"),
        "physics": t("subjectsSection.physics"),
    };

    const presetDescMap: Record<string, string> = {
        "mathematics": t("subjects.presetDescriptions.mathematics"),
        "computer-science": t("subjects.presetDescriptions.computerScience"),
        "chemistry": t("subjects.presetDescriptions.chemistry"),
        "physics": t("subjects.presetDescriptions.physics"),
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12 bg-[#fdfaf6]">
            {/* Lined Notebook Paper Aesthetics */}
            {/* Red margins */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            {/* Notebook Spiral Binding */}
            <NotebookSpiral />

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-8 w-full max-w-[1200px] pl-6 md:pl-12">
                
                {/* Doodles background decoration */}
                <div className="absolute top-[2%] left-[-4%] w-[120px] h-[120px] mix-blend-multiply pointer-events-none opacity-40">
                    <Image src="/Flask.png" alt="Flask" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                </div>
                <div className="absolute bottom-[4%] right-[-4%] w-[130px] h-[130px] mix-blend-multiply pointer-events-none opacity-40">
                    <Image src="/Molecular_Model.png" alt="Molecule" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                </div>

                {/* Headline Section */}
                <div className="text-center mb-10">
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight uppercase font-sans">
                            {t("subjects.directoryTitle")}
                        </h1>
                        <div className="absolute -bottom-3 left-0 w-[110%] h-6 -ml-[5%] opacity-90 mix-blend-multiply">
                            <Image src="/title_underline.png" alt="Underline" fill className="object-contain contrast-[1.1] brightness-[1.1]" />
                        </div>
                    </div>
                    <p className="font-hand text-[22px] text-slate-700 font-medium mt-4">
                        {t("subjects.directorySubtitle")}
                    </p>
                </div>

                {/* Subject Cards Grid */}
                {loading ? (
                    <div className="text-center py-16 font-hand text-2xl text-slate-600 font-bold">
                        {t("subjects.loadingFields")}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[950px] mt-4">
                        {fields.map((field) => {
                            const slug = field.slug || field.name.toLowerCase().replace(/\s+/g, "-");
                            const preset = PRESET_SUBJECTS[slug];
                            const icon = preset?.icon || DEFAULT_ICON;
                            const displayName = fieldNameMap[slug] || (isRTL && (field as any).faName ? (field as any).faName : field.name);
                            const description = presetDescMap[slug] || field.description || t("subjects.defaultDescription");

                            return (
                                <Link
                                    key={slug}
                                    href={`/subjects/${slug}`}
                                    className="relative flex flex-col items-center justify-between p-8 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer min-h-[300px] group/card rounded-[16px]"
                                >
                                    <RoughCardBackground />

                                    {/* Hover highlight */}
                                    <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

                                    <div className="flex flex-col items-center text-center z-10 w-full">
                                        <div className="mb-4 transform group-hover/card:scale-105 transition-transform duration-300">
                                            {icon}
                                        </div>
                                        <h3 className="font-sans text-2xl font-bold text-slate-800 leading-tight">
                                            {displayName}
                                        </h3>
                                        <p className="font-hand text-lg text-slate-600 mt-2 max-w-[340px] leading-relaxed">
                                            {description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-600 font-hand text-xl font-bold group-hover/card:text-blue-600 transition-colors z-10 mt-4 mb-2">
                                        {t("subjects.exploreLessons")}
                                        <svg className="w-5 h-5 transition-transform duration-300 group-hover/card:translate-x-1 rtl:group-hover/card:-translate-x-1 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M5 12h14m-7-7 7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
