"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface IUserProfile {
    _id: string;
    name: string;
    last_name?: string;
    email: string;
    student_id?: string;
    department?: string;
    role: "guest" | "user" | "admin";
    status: "Active" | "Banned";
    provider?: string;
}

export default function ProfilePage() {
    const { isLoggedIn, isInitialized, status: authStatus, handleSignOut } = useAuthStatus();
    const router = useRouter();
    const { t, isRTL } = useLanguage();

    const [user, setUser] = useState<IUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form inputs
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [department, setDepartment] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setError(null);
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const res = await fetch("/api/users/me", { headers });
                if (res.ok) {
                    const data: IUserProfile = await res.json();
                    setUser(data);
                    setName(data.name || "");
                    setLastName(data.last_name || "");
                    setStudentId(data.student_id || "");
                    setDepartment(data.department || "");
                } else if (res.status === 401) {
                    setError(t("notesUpload.loginRequiredSubtitle"));
                } else {
                    setError(t("profilePage.profileUpdateFailed"));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(t("profilePage.profileUpdateFailed"));
            } finally {
                setLoading(false);
            }
        };

        if (isInitialized && isLoggedIn) {
            fetchProfile();
        } else if (isInitialized && !isLoggedIn) {
            setLoading(false);
        }
    }, [isInitialized, isLoggedIn, t]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name.trim()) {
            setError(t("profilePage.firstNameRequired"));
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch("/api/users/me", {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    name: name.trim(),
                    last_name: lastName.trim(),
                    student_id: studentId.trim(),
                    department: department.trim(),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data);
                setSuccess(t("profilePage.profileUpdatedSuccess"));
            } else {
                setError(data.message || t("profilePage.profileUpdateFailed"));
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(t("profilePage.profileUpdateFailed"));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch("/api/users/me", {
                method: "DELETE",
                headers,
            });

            if (res.ok) {
                await handleSignOut();
                router.push("/");
            } else {
                const data = await res.json();
                setError(data.message || t("profilePage.profileUpdateFailed"));
                setShowDeleteModal(false);
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            setError(t("profilePage.profileUpdateFailed"));
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    if (!isInitialized || authStatus === "loading" || loading) {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden p-8 bg-[#fdfaf6]">
                <div className="w-full max-w-sm bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-xl flex flex-col items-center text-center">
                    <div className="animate-spin mb-4 text-blue-600">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-slate-800 uppercase tracking-wider">{t("profilePage.loadingTitle")}</h3>
                    <p className="font-hand text-[19px] text-slate-600 mt-2">{t("profilePage.loadingSubtitle")}</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12 bg-[#fdfaf6]">
                <Navbar />
                <div className="mt-16 w-full max-w-md bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-xl flex flex-col items-center text-center">
                    <h2 className="text-3xl font-extrabold text-[#2a2d64] tracking-tight uppercase mb-2 font-sans">
                        {t("profilePage.signInRequiredTitle")}
                    </h2>
                    <p className="font-hand text-[20px] text-slate-700 leading-relaxed mb-6">
                        {t("profilePage.signInRequiredSubtitle")}
                    </p>
                    <Link
                        href="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-base tracking-wide transition-all shadow-md shadow-blue-600/20 uppercase"
                    >
                        {t("profilePage.goToLogin")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden pt-4 px-8 pb-12 bg-[#fdfaf6]">
            {/* Left red notebook margin lines */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>
            <div className="absolute left-11 top-0 bottom-0 w-px bg-red-400 opacity-50 z-0 hidden md:block mix-blend-multiply"></div>

            <Navbar />

            <main className="relative flex-1 flex flex-col items-center mt-6 w-full max-w-4xl">
                {/* Header Icon & Title */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-700 font-extrabold text-3xl shadow-md mb-3 font-sans">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a2d64] tracking-tight uppercase font-sans">
                        {t("profilePage.pageTitle")}
                    </h1>
                    <p className="font-hand text-[22px] text-slate-700 font-medium mt-1">
                        {t("profilePage.pageSubtitle")}
                    </p>
                </div>

                {/* Profile Card */}
                <div className="w-full bg-[#fdfaf6] border border-slate-400 p-6 md:p-10 rounded-[16px] shadow-xl flex flex-col gap-6">
                    {/* Role & Status Pill Badges */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-300 pb-4 gap-3">
                        <div className="flex items-center gap-3">
                            <span className="font-hand text-[19px] text-slate-700 font-bold">{t("profilePage.accountRoleLabel")}</span>
                            <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.role === "admin" ? "bg-purple-100 text-purple-800 border border-purple-300" : "bg-blue-100 text-blue-800 border border-blue-300"}`}>
                                {user?.role === "admin" ? t("profilePage.roleAdmin") : t("profilePage.roleUser")}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-hand text-[19px] text-slate-700 font-bold">{t("profilePage.statusLabel")}</span>
                            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
                                {t("profilePage.statusActive")}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* First Name */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("profilePage.firstNameLabel")}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("profilePage.lastNameLabel")}
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={t("profilePage.optionalPlaceholder")}
                                    className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div>
                            <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                {t("profilePage.emailReadOnlyLabel")}
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 bg-slate-100/80 border border-slate-300 rounded-lg text-slate-600 font-sans cursor-not-allowed shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Student ID */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("profilePage.studentIdLabel")}
                                </label>
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder={t("profilePage.studentIdPlaceholder")}
                                    className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                />
                            </div>

                            {/* Department / Field */}
                            <div>
                                <label className="block text-[18px] font-hand text-slate-800 font-bold mb-1.5">
                                    {t("profilePage.departmentLabel")}
                                </label>
                                <input
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    placeholder={t("profilePage.departmentPlaceholder")}
                                    className="w-full px-4 py-2.5 bg-[#fdfaf6] border border-slate-400 rounded-lg text-slate-800 font-sans focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Notifications */}
                        {error && (
                            <div className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-green-700 text-sm font-semibold text-center bg-green-50 p-3 rounded-lg border border-green-200">
                                {success}
                            </div>
                        )}

                        {/* Action Buttons: Sign Out & Save Profile */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => setShowSignOutModal(true)}
                                className="bg-white border-2 border-slate-400 hover:bg-slate-100 text-slate-700 font-semibold px-6 py-2.5 rounded-full text-base transition-all shadow-sm active:scale-95 uppercase"
                            >
                                {t("profilePage.signOutButton")}
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full text-base tracking-wide transition-all shadow-md shadow-blue-600/20 uppercase active:scale-95 disabled:opacity-70"
                            >
                                {saving ? t("profilePage.savingChangesButton") : t("profilePage.saveProfileButton")}
                            </button>
                        </div>
                    </form>

                    {/* Delete Account Section */}
                    <div className="mt-8 border-t border-slate-300 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-sans font-bold text-slate-800 text-base uppercase tracking-wider">
                                {t("profilePage.deleteAccountTitle")}
                            </h4>
                            <p className="font-hand text-[17px] text-slate-600">
                                {t("profilePage.deleteAccountSubtitle")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 font-medium px-6 py-2.5 rounded-full text-sm transition-all whitespace-nowrap"
                        >
                            {t("profilePage.deleteAccountButton")}
                        </button>
                    </div>
                </div>
            </main>

            {/* Sign Out Confirmation Modal */}
            {showSignOutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-[#fdfaf6] border border-slate-400 p-8 rounded-[16px] shadow-2xl max-w-md w-full text-center">
                        <h3 className="text-2xl font-extrabold text-slate-800 uppercase font-sans mb-3">
                            {t("profilePage.confirmSignOutTitle")}
                        </h3>
                        <p className="font-hand text-[19px] text-slate-700 mb-6">
                            {t("profilePage.confirmSignOutSubtitle")}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setShowSignOutModal(false)}
                                className="px-6 py-2.5 border border-slate-400 text-slate-700 rounded-full font-medium hover:bg-slate-100 transition-colors"
                            >
                                {t("profilePage.cancelButton")}
                            </button>
                            <button
                                onClick={async () => {
                                    setShowSignOutModal(false);
                                    await handleSignOut();
                                    router.push("/login");
                                }}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-full font-semibold transition-colors uppercase"
                            >
                                {t("profilePage.signOutButton")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Deletion Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-[#fdfaf6] border border-red-400 p-8 rounded-[16px] shadow-2xl max-w-md w-full text-center">
                        <h3 className="text-2xl font-extrabold text-red-700 uppercase font-sans mb-3">
                            {t("profilePage.confirmDeleteTitle")}
                        </h3>
                        <p className="font-hand text-[19px] text-slate-700 mb-6">
                            {t("profilePage.confirmDeleteSubtitle")}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2.5 border border-slate-400 text-slate-700 rounded-full font-medium hover:bg-slate-100 transition-colors"
                            >
                                {t("profilePage.cancelButton")}
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors disabled:opacity-75"
                            >
                                {deleting ? t("profilePage.deletingButton") : t("profilePage.yesDeleteAccountButton")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
