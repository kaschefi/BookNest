"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export default function Stats() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener('resize', checkScrollButtons);
        return () => window.removeEventListener('resize', checkScrollButtons);
    }, []);

    const getScrollAmount = () => {
        if (scrollContainerRef.current) {
            const firstCard = scrollContainerRef.current.querySelector('a');
            if (firstCard) {
                const gap = parseInt(window.getComputedStyle(scrollContainerRef.current).gap) || 0;
                return firstCard.offsetWidth + gap;
            }
        }
        return 217; // fallback
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        }
    };

    const subjects = [
        {
            name: "Computer\nScience",
            icon: (
                <svg className="w-[80px] h-[80px] text-slate-800 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M25 65 L25 35 C25 32 27 30 30 30 L70 30 C73 30 75 32 75 35 L75 65" />
                    <path d="M15 65 L85 65 C88 65 90 67 90 70 C90 73 88 75 85 75 L15 75 C12 75 10 73 10 70 C10 67 12 65 15 65 Z" fill="#f8fafc" />
                    <path d="M42 42 L35 48 L42 54" />
                    <path d="M58 42 L65 48 L58 54" />
                    <path d="M53 38 L47 58" />
                </svg>
            ),
            href: "/subjects/computer-science"
        },
        {
            name: "Mathematics",
            icon: (
                <svg className="w-[80px] h-[80px] text-slate-800 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="25" y="20" width="50" height="60" rx="6" />
                    <line x1="25" y1="50" x2="75" y2="50" />
                    <line x1="50" y1="20" x2="50" y2="80" />
                    <path d="M37.5 31 L37.5 39 M33.5 35 L41.5 35" />
                    <path d="M58.5 35 L66.5 35" />
                    <path d="M34 61 L41 69 M41 61 L34 69" />
                    <path d="M58.5 65 L66.5 65 M62.5 59 L62.5 60 M62.5 70 L62.5 71" />
                </svg>
            ),
            href: "/subjects/mathematics"
        },
        {
            name: "Chemistry",
            icon: (
                <svg className="w-[80px] h-[80px] text-slate-800 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="50" cy="25" rx="8" ry="3" />
                    <path d="M42 25 L42 45 L25 75 C20 84 26 90 35 90 L65 90 C74 90 80 84 75 75 L58 45 L58 25" />
                    <path d="M32 63 C40 66 60 60 68 63 L73.5 73 C76 78 72 85 65 85 L35 85 C28 85 24 78 26.5 73 Z" fill="#e0e7ff" stroke="none" />
                    <path d="M32 63 C40 66 60 60 68 63" stroke="#4f46e5" strokeWidth="1.5" />
                    <circle cx="45" cy="78" r="3" fill="white" stroke="none" opacity="0.8" />
                    <circle cx="55" cy="72" r="1.5" fill="white" stroke="none" opacity="0.8" />
                    <circle cx="48" cy="85" r="1" fill="white" stroke="none" opacity="0.8" />
                </svg>
            ),
            href: "/subjects/chemistry"
        },
        {
            name: "Physics",
            icon: (
                <svg className="w-[80px] h-[80px] text-slate-800 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(30 50 50)" />
                    <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(90 50 50)" />
                    <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(150 50 50)" />
                    <circle cx="50" cy="50" r="8" fill="#1e40af" stroke="#1e3a8a" />
                    <circle cx="50" cy="50" r="3" fill="#60a5fa" stroke="none" />
                </svg>
            ),
            href: "/subjects/physics"
        },
        {
            name: "More\nSubjects",
            icon: (
                <svg className="w-[80px] h-[80px] text-slate-800 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 75 C20 75 30 70 50 75 C70 70 80 75 80 75 L80 25 C80 25 70 20 50 25 C30 20 20 25 20 25 Z" fill="#f8fafc" />
                    <path d="M50 25 L50 75" />
                    <path d="M26 33 C33 31 43 33 46 34" />
                    <path d="M26 43 C33 41 43 43 46 44" />
                    <path d="M26 53 C33 51 43 53 46 54" />
                    <path d="M26 63 C33 61 43 63 46 64" />
                    <path d="M74 33 C67 31 57 33 54 34" />
                    <path d="M74 43 C67 41 57 43 54 44" />
                    <path d="M74 53 C67 51 57 53 54 54" />
                    <path d="M74 63 C67 61 57 63 54 64" />
                </svg>
            ),
            href: "/subjects"
        },
    ];

    return (
        /* CHANGE `max-w-[1200px]` BELOW to move the cards more to the left and right of the page (e.g., max-w-[1400px], max-w-full, or max-w-7xl) */
        <div className="relative z-20 w-full max-w-[1200px] mt-12 mb-8 px-16">
            <div className="relative flex items-center group">

                {/* Left Scroll Button */}
                <button
                    onClick={scrollLeft}
                    className={`absolute -left-16 z-10 p-3 m-2 bg-white shadow-md rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 hover:scale-105 transition-all ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    /* CHANGE `gap-8` BELOW to adjust the space between the cards (e.g., gap-10, gap-12, or gap-5) */
                    className="flex w-full gap-8 overflow-x-auto snap-x snap-mandatory py-4 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        div::-webkit-scrollbar { display: none; }
                    `}} />

                    {subjects.map((subject, index) => (
                        <Link
                            href={subject.href}
                            key={index}
                            className="flex flex-col items-center justify-between p-6 bg-white border-2 border-slate-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 cursor-pointer min-w-[185px] w-[185px] h-[280px] shrink-0 snap-start group/card relative overflow-hidden"
                        >
                            {/* Subtle background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover/card:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="flex flex-col items-center mt-3 z-10">
                                {subject.icon}
                                <h3 className="font-hand text-[22px] font-bold text-slate-800 text-center whitespace-pre-line leading-tight mt-1">
                                    {subject.name}
                                </h3>
                                <svg className="w-12 h-2 text-slate-300 mt-2 opacity-60" viewBox="0 0 100 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 5 Q 25 0, 50 5 T 95 5" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 font-hand text-lg font-medium group-hover/card:text-blue-600 transition-colors z-10 mb-2">
                                Explore
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover/card:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M5 12h14m-7-7 7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={scrollRight}
                    className={`absolute -right-16 z-10 p-3 m-2 bg-white shadow-md rounded-full border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 hover:scale-105 transition-all ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>

            </div>
        </div>
    );
}