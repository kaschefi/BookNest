import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongoose";
import File from "../../models/File";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === "GET") {
        const files = await File.find();
        return res.json(files);
    }

    if (req.method === "POST") {
        const file = await File.create(req.body);
        return res.json(file);
    }
}