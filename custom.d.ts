import mongoose from "mongoose";
import NextAuth from "next-auth";


declare global {
    var mongoose: mongoose;
}

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}