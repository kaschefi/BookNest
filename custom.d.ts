import mongoose from "mongoose";
import type { DefaultSession } from "next-auth";

type UserRole = "guest" | "user" | "admin";

declare global {
    var mongoose: mongoose;
}

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user?: DefaultSession["user"] & {
            id?: string;
            role?: UserRole;
            provider?: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
        role?: UserRole;
        provider?: string;
    }
}
