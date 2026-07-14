import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.status === "Banned") {
        return res.status(403).json({ message: "Your account is banned. Please contact support." });
    }

    if (!user.password) {
        return res.status(400).json({ message: "Please log in with your social account." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
}