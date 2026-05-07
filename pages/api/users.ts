import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongoose";
import User from "../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === "GET") {
        const users = await User.find();
        return res.json(users);
    }

    if (req.method === "POST") {
        const user = await User.create(req.body);
        return res.json(user);
    }
}