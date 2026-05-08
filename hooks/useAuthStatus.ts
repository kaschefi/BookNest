"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthStatus() {
    const { status } = useSession();
    const [isJwtLoggedIn, setIsJwtLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsJwtLoggedIn(!!token);
    }, []);

    const isLoggedIn = isJwtLoggedIn || status === "authenticated";

    const handleSignOut = async () => {
        // Clear custom JWT
        localStorage.removeItem("token");
        setIsJwtLoggedIn(false);

        // Sign out from NextAuth (OAuth)
        if (status === "authenticated") {
            const { signOut } = await import("next-auth/react");
            await signOut({ redirect: false });
        }
    };

    return {
        isLoggedIn,
        isJwtLoggedIn,
        isOAuth: status === "authenticated",
        handleSignOut,
        status, // "loading" | "authenticated" | "unauthenticated"
    };
}