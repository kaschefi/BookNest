import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import {
    deleteField,
    getFieldById,
    updateField,
} from "../../../../services/FieldService";

function routeId(req: NextApiRequest) {
    const id = req.query.id;
    return Array.isArray(id) ? id[0] : id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const id = routeId(req);
    if (!id) return res.status(400).json({ message: "Missing id" });

    if (req.method === "GET") {
        const field = await getFieldById(id);
        if (!field) return res.status(404).json({ message: "Field not found" });
        return res.status(200).json(field);
    }

    if (req.method === "PUT") {
        const { name } = req.body as { name?: string };
        if (!name?.trim()) return res.status(400).json({ message: "Missing field name" });

        const updated = await updateField(id, { name });
        if (!updated) return res.status(404).json({ message: "Field not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        const deleted = await deleteField(id);
        if (!deleted) return res.status(404).json({ message: "Field not found" });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}
