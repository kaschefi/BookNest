import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import {
    deleteLesson,
    getLessonById,
    updateLesson,
} from "../../../../services/LessonService";

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
        const lesson = await getLessonById(id);
        if (!lesson) return res.status(404).json({ message: "Lesson not found" });
        return res.status(200).json(lesson);
    }

    if (req.method === "PUT") {
        const { name, field, fieldId } = req.body as {
            name?: string;
            field?: string;
            fieldId?: string;
        };
        const resolvedField = field ?? fieldId;

        if (!name?.trim() && !resolvedField) {
            return res.status(400).json({ message: "No lesson updates provided" });
        }

        const updated = await updateLesson(id, { name, field: resolvedField });
        if (!updated) return res.status(404).json({ message: "Lesson not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        const deleted = await deleteLesson(id);
        if (!deleted) return res.status(404).json({ message: "Lesson not found" });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}
