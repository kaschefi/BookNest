import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: {
                params: {
                    scope: "read:user user:email",
                },
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],

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
                    });
                } else if (existing.provider === "local") {
                    // If they have no password, they originally signed up via OAuth (GitHub)
                    // before the "provider" field was correctly populated with "github".
                    // We should automatically migrate them to "github" and let them through!
                    if (!existing.password) {
                        existing.provider = provider;
                        await existing.save();
                    } else {
                        // Email already registered locally with a password — block OAuth sign-in
                        // to avoid account takeover.
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

        async jwt({ token, user, account }) {
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
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).provider = token.provider;
            }
            return session;
        },
    },

    pages: {
        // Redirect here on OAuth errors (e.g. EmailUsedLocally)
        error: "/login",
    },
});