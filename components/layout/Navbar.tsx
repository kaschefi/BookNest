"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { isLoggedIn, handleSignOut } = useAuthStatus();
    const pathname = usePathname();

    const isHomeActive = pathname === "/";
    const isNotesActive = pathname ? pathname.startsWith("/notes") : false;

    return (
        <nav className="relative z-20 w-full max-w-7xl flex justify-between items-center py-4">
            {/* Logo */}
            <Logo />

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
                <Link href="/" className={`relative pb-1 hover:text-blue-600 transition-colors ${isHomeActive ? "text-slate-900 font-semibold" : ""}`}>
                    Home
                    {isHomeActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-blue-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                    Books
                </Link>
                <Link href="/notes" className={`relative pb-1 hover:text-blue-600 transition-colors ${isNotesActive ? "text-slate-900 font-semibold" : ""}`}>
                    Notes
                    {isNotesActive && (
                        <svg className="absolute left-0 bottom-[-4px] w-full h-[6px] text-red-500 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M2,6 Q50,2 98,6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    )}
                </Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                    Subjects
                </Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                    About
                </Link>
                <Link href="#" className="hover:text-blue-600 transition-colors">
                    Contact
                </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <button className="text-slate-600 hover:text-slate-900">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>

                {/* Auth Button */}
                {isLoggedIn ? (
                    <button
                        onClick={handleSignOut}
                        className="bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-medium transition-all"
                    >
                        Sign Out
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                        Join / Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}