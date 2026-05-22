import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from '../../lib/mongoose';
import Field from "../../models/Field";
import { seedDBIfEmpty } from "../../lib/seed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    await seedDBIfEmpty();

    if (req.method === "GET") {
        const fields = await Field.find().sort({ name: 1 });
        return res.json(fields);
    }

    if (req.method === "POST") {
        const field = await Field.create(req.body);
        return res.json(field);
    }
}