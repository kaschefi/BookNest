import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import {
    deleteResource,
    getResourceById,
    updateResource,
} from "../../../../services/ResourceService";
import { deleteFile } from "../../../../services/UploadService";

function routeId(req: NextApiRequest) {
    const id = req.query.id;
    return Array.isArray(id) ? id[0] : id;
}

function buildResourceUpdate(body: Record<string, unknown>, adminId: string) {
    const update: Parameters<typeof updateResource>[1] = {};

    if (typeof body.title === "string") update.title = body.title;
    if (["midterm", "final", "pamphlet"].includes(String(body.type))) {
        update.type = body.type as "midterm" | "final" | "pamphlet";
    }
    if (["fall", "spring", "summer"].includes(String(body.semester))) {
        update.semester = body.semester as string;
    }
    if (typeof body.year === "number") update.year = body.year;
    if (["pending", "approved", "rejected"].includes(String(body.status))) {
        update.status = body.status as "pending" | "approved" | "rejected";
        update.reviewedBy = adminId;
    }
    if (typeof body.reviewNote === "string") update.reviewNote = body.reviewNote;

    return update;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const id = routeId(req);
    if (!id) return res.status(400).json({ message: "Missing id" });

    if (req.method === "GET") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Resource not found" });
        return res.status(200).json(resource);
    }

    if (req.method === "PUT") {
        const update = buildResourceUpdate(req.body, admin.id);
        const updated = await updateResource(id, update);
        if (!updated) return res.status(404).json({ message: "Resource not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        await deleteFile(resource.publicId);
        await deleteResource(id);

        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}
