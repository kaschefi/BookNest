import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongoose";
import Lesson from "../../models/Lesson";
import { seedDBIfEmpty } from "../../lib/seed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    await seedDBIfEmpty();

    if (req.method === "GET") {
        const lessons = await Lesson.find().sort({ name: 1 });
        return res.json(lessons);
    }

    if (req.method === "POST") {
        const lesson = await Lesson.create(req.body);
        return res.json(lesson);
    }
}