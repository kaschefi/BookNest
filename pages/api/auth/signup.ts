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

    const existingUser = await User.findOne({
        $or: [{ email }, { name }]
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Split Full Name into first and last name
        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "N/A";

        const user = await User.create({
            name: firstName,
            last_name: lastName,
            student_id: `tmp_${Date.now()}`,
            field_id: new mongoose.Types.ObjectId(),
            email,
            password: hashedPassword,
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