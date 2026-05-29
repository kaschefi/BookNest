import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import { createField, getAllFields } from "../../../../services/FieldService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === "GET") {
        const fields = await getAllFields();
        return res.status(200).json(fields);
    }

    if (req.method === "POST") {
        const { name } = req.body as { name?: string };
        if (!name?.trim()) return res.status(400).json({ message: "Missing field name" });

        const field = await createField({ name });
        return res.status(201).json(field);
    }

    return res.status(405).json({ message: "Method not allowed" });
}
