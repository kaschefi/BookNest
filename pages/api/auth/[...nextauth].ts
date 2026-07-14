import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        })
    );
}

export const authOptions: NextAuthOptions = {
    providers,

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            try {
                await connectDB();

                if (!user.email) return false;

                const provider = account?.provider ?? "github";
                const existing = await User.findOne({ email: user.email });

                if (!existing) {
                    // New OAuth user — create them
                    await User.create({
                        name: user.name?.split(" ")[0] || "User",
                        last_name: user.name?.split(" ").slice(1).join(" ") || "",
                        email: user.email,
                        provider,
                        role: "user",
                        status: "Active",
                    });
                } else {
                    if (existing.status === "Banned") {
                        return `/login?error=Banned`;
                    }
                    if (existing.provider === "local") {
                        // Email already registered locally — block OAuth sign-in
                        // to avoid account takeover. You can remove this check
                        // if you want to allow linking accounts.
                        return `/login?error=EmailUsedLocally`;
                    }
                }
                // else: existing OAuth user, just let them through

                return true;
            } catch (error) {
                console.error("NextAuth signIn Error:", error);
                return false;
            }
        },

        async jwt({ token, user }) {
            await connectDB();

            // On first sign-in, user & account are available
            const email = token.email ?? user?.email;
            if (email) {
                const dbUser = await User.findOne({ email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.provider = dbUser.provider;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.provider = token.provider;
            }
            return session;
        },
    },

    pages: {
        // Redirect here on OAuth errors (e.g. EmailUsedLocally)
        error: "/login",
    },
};

export default NextAuth(authOptions);
