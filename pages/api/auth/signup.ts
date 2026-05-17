import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await connectDB();

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    // Only check email — checking name blocked users who share a first name
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.provider !== "local") {
            return res.status(400).json({
                message: `This email is already linked to a ${existingUser.provider} account. Please sign in with ${existingUser.provider}.`
            });
        }
        return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const user = await User.create({
            name: firstName,
            last_name: lastName,
            student_id: `tmp_${Date.now()}`,
            field_id: new mongoose.Types.ObjectId(),
            email,
            password: hashedPassword,
            provider: "local",
            role: "user"
        });

        return res.status(201).json({
            message: "User created",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}