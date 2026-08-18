"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar({ toggleSidebar, hideSidebarButton, hideLogo }: { toggleSidebar?: () => void; hideSidebarButton?: boolean; hideLogo?: boolean } = {}) {
    const { isLoggedIn, isAdmin, handleSignOut } = useAuthStatus();
    const pathname = usePathname();
    const { t, language, toggleLanguage } = useLanguage();

    const isHomeActive = pathname === "/";
    const isNotesActive = pathname ? pathname.startsWith("/notes") : false;
    const isSubjectsActive = pathname ? pathname.startsWith("/subjects") : false;
    const isResourcesActive = pathname ? pathname.startsWith("/resources") : false;

    return (
        <nav className="relative z-20 w-full max-w-7xl flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
                {toggleSidebar && (
                    hideSidebarButton ? (
                        <div className="w-10 h-10" />
                    ) : (
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    )
                )}
                {/* Logo */}
                {!hideLogo && <Logo />}
            </div>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
                <Link href="/" className={`relative pb-1 hover:text-blue-600 transition-colors ${isHomeActive ? "text-slate-900 font-semibold" : ""}`}>
                    {t("nav.home")}
                    {isHomeActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-blue-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>
                <Link href="/notes" className={`relative pb-1 hover:text-blue-600 transition-colors ${isNotesActive ? "text-slate-900 font-semibold" : ""}`}>
                    {t("nav.uploadNotes")}
                    {isNotesActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-red-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>
                <Link href="/subjects" className={`relative pb-1 hover:text-blue-600 transition-colors ${isSubjectsActive ? "text-slate-900 font-semibold" : ""}`}>
                    {t("nav.subjects")}
                    {isSubjectsActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-green-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>
                <Link href="/resources" className={`relative pb-1 hover:text-blue-600 transition-colors ${isResourcesActive ? "text-slate-900 font-semibold" : ""}`}>
                    {t("nav.search")}
                    {isResourcesActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-amber-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>

                {isLoggedIn && (
                    <Link href="/profile" className={`relative pb-1 hover:text-blue-600 transition-colors ${pathname?.startsWith("/profile") ? "text-slate-900 font-semibold" : ""}`}>
                        {t("nav.profile")}
                        {pathname?.startsWith("/profile") && (
                            <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-blue-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                    </Link>
                )}

                {isAdmin && (
                    <Link href="/admin" className={`relative pb-1 hover:text-blue-600 transition-colors ${pathname?.startsWith("/admin") ? "text-slate-900 font-semibold" : ""}`}>
                        {t("nav.adminPanel")}
                        {pathname?.startsWith("/admin") && (
                            <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-purple-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        )}
                    </Link>
                )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Language Switcher Button */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                    title={language === "en" ? "تغییر زبان به فارسی" : "Switch to English"}
                    aria-label="Switch Language"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>{language === "en" ? "فارسی" : "English"}</span>
                </button>

                {!isLoggedIn && (
                    <Link
                        href={pathname === "/login" ? "/signup" : "/login"}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                        {pathname === "/login" ? t("nav.signUp") : t("nav.signIn")}
                    </Link>
                )}
            </div>
        </nav>
    );
}