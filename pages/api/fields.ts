import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from '../../lib/mongoose';
import Field from "../../models/Field";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === "GET") {
        const fields = await Field.find();
        return res.json(fields);
    }

    if (req.method === "POST") {
        const field = await Field.create(req.body);
        return res.json(field);
    }
}