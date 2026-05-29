import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import {
    createLesson,
    getAllLessons,
    getLessonsByField,
} from "../../../../services/LessonService";

function queryString(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === "GET") {
        const fieldId = queryString(req.query.fieldId);
        const lessons = fieldId ? await getLessonsByField(fieldId) : await getAllLessons();
        return res.status(200).json(lessons);
    }

    if (req.method === "POST") {
        const { name, field, fieldId } = req.body as {
            name?: string;
            field?: string;
            fieldId?: string;
        };
        const resolvedField = field ?? fieldId;

        if (!name?.trim() || !resolvedField) {
            return res.status(400).json({ message: "Missing lesson name or field" });
        }

        const lesson = await createLesson({ name, field: resolvedField });
        return res.status(201).json(lesson);
    }

    return res.status(405).json({ message: "Method not allowed" });
}
