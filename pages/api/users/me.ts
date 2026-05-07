import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ message: "No token" });
    }

    const token = auth.split(" ")[1];

    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        const user = await User.findById(decoded.id).select("-password");

        return res.json(user);
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}