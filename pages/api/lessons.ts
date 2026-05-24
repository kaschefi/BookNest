import type { NextApiRequest, NextApiResponse } from "next";
import { getRoleFromRequest } from "../../middleware/auth";
import { hasPermission } from "../../lib/permissions";
import {
    getAllLessons,
    getLessonsByField,
    createLesson,
    updateLesson,
    deleteLesson,
} from "../../services/LessonService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const role = getRoleFromRequest(req);

    if (req.method === "GET") {
        // Optional filter: /api/lessons?fieldId=xxx
        const { fieldId } = req.query;
        const lessons = fieldId
            ? await getLessonsByField(fieldId as string)
            : await getAllLessons();
        return res.status(200).json(lessons);
    }

    if (req.method === "POST") {
        if (!hasPermission(role, "create_lesson")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const lesson = await createLesson(req.body);
        return res.status(201).json(lesson);
    }

    if (req.method === "PUT") {
        if (!hasPermission(role, "create_lesson")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id, ...data } = req.body;
        if (!id) return res.status(400).json({ message: "Missing id" });
        const updated = await updateLesson(id, data);
        if (!updated) return res.status(404).json({ message: "Lesson not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        if (!hasPermission(role, "create_lesson")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "Missing id" });
        const deleted = await deleteLesson(id);
        if (!deleted) return res.status(404).json({ message: "Lesson not found" });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}