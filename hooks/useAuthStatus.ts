"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthStatus() {
    const { data: session, status } = useSession();
    const [isJwtLoggedIn, setIsJwtLoggedIn] = useState(false);
    const [jwtRole, setJwtRole] = useState<string | null>(null);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (token) {
                setIsJwtLoggedIn(true);
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setJwtRole(payload.role || "user");
                } catch {
                    console.error("Invalid token format");
                }
            } else {
                setIsJwtLoggedIn(false);
            }
            setIsInitialized(true);
        };
        checkToken();
    }, []);

    const isLoggedIn = isJwtLoggedIn || status === "authenticated";
    const isAdmin = jwtRole === "admin" || session?.user?.role === "admin";

    const handleSignOut = async () => {
        // Clear custom JWT
        localStorage.removeItem("token");
        setIsJwtLoggedIn(false);
        setJwtRole(null);

        // Sign out from NextAuth (OAuth)
        if (status === "authenticated") {
            const { signOut } = await import("next-auth/react");
            await signOut({ redirect: false });
        }
    };

    return {
        isLoggedIn,
        isAdmin,
        isJwtLoggedIn,
        isInitialized,
        isOAuth: status === "authenticated",
        handleSignOut,
        status, // "loading" | "authenticated" | "unauthenticated"
    };
}