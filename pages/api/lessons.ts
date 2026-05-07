import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongoose";
import Lesson from "../../models/Lesson";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === "GET") {
        const lessons = await Lesson.find();
        return res.json(lessons);
    }

    if (req.method === "POST") {
        const lesson = await Lesson.create(req.body);
        return res.json(lesson);
    }
}