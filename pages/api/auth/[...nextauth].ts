import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            try {
                await connectDB();

                if (!user.email) {
                    return false;
                }

                const existing = await User.findOne({
                    email: user.email,
                });

                if (!existing) {
                    await User.create({
                        name: user.name || "GitHub User",
                        email: user.email,

                        // CHANGED: store OAuth provider type for schema compatibility
                        authProvider: account?.provider || "github",

                        // CHANGED: store GitHub unique ID for account linking
                        githubId: account?.providerAccountId,

                        role: "user",
                    });
                }

                return true;
            } catch (error) {
                console.error("NextAuth signIn Error:", error);
                return false;
            }
        },

        async jwt({ token, user }) {
            await connectDB();

            if (user?.email) {
                const dbUser = await User.findOne({
                    email: user.email,
                });

                if (dbUser) {
                    token.id = dbUser._id.toString();

                    // CHANGED: include role in JWT for authorization layer
                    token.role = dbUser.role;

                    // CHANGED: include auth provider for frontend logic (optional but useful)
                    token.authProvider = dbUser.authProvider;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;

                // CHANGED: expose role in session for UI/route guards
                (session.user as any).role = token.role;

                // CHANGED: expose auth provider in session for conditional UI
                (session.user as any).authProvider = token.authProvider;
            }

            return session;
        },
    },
});