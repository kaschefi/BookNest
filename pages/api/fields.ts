import type { NextApiRequest, NextApiResponse } from "next";
import { getRoleFromRequest } from "../../middleware/auth";
import { hasPermission } from "../../lib/permissions";
import {
    getAllFields,
    createField,
    updateField,
    deleteField,
} from "../../services/FieldService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const role = getRoleFromRequest(req);

    if (req.method === "GET") {
        const fields = await getAllFields();
        return res.status(200).json(fields);
    }

    if (req.method === "POST") {
        if (!hasPermission(role, "create_field")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const field = await createField(req.body);
        return res.status(201).json(field);
    }

    if (req.method === "PUT") {
        if (!hasPermission(role, "create_field")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id, ...data } = req.body;
        if (!id) return res.status(400).json({ message: "Missing id" });
        const updated = await updateField(id, data);
        if (!updated) return res.status(404).json({ message: "Field not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        if (!hasPermission(role, "create_field")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "Missing id" });
        const deleted = await deleteField(id);
        if (!deleted) return res.status(404).json({ message: "Field not found" });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}