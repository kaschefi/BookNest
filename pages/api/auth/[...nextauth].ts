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
        async signIn({ user }) {
            await connectDB();

            const existing = await User.findOne({ email: user.email });

            if (!existing) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    role: "user",
                });
            }

            return true;
        },

        async jwt({ token, user }) {
            await connectDB();

            if (user) {
                const dbUser = await User.findOne({ email: user.email });

                if (dbUser) {
                    token.id = dbUser._id;
                    token.role = dbUser.role;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }

            return session;
        },
    },
});