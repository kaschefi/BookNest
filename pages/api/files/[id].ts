import type { NextApiRequest, NextApiResponse } from "next";
import { getRoleFromRequest } from "../../../middleware/auth";
import { hasPermission } from "../../../lib/permissions";
import {
    getResourceById,
    updateResource,
    deleteResource,
    incrementViews,
} from "../../../services/ResourceService";
import { deleteFile } from "../../../services/UploadService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const role = getRoleFromRequest(req);
    const { id } = req.query as { id: string };

    // ── GET /api/files/[id] ───────────────────────────────────────────────────
    if (req.method === "GET") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Not found" });
        // Increment view count (fire-and-forget — don't block the response)
        incrementViews(id).catch(() => {});
        return res.status(200).json(resource);
    }

    // ── PUT /api/files/[id] ───────────────────────────────────────────────────
    if (req.method === "PUT") {
        if (!hasPermission(role, "upload")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updated = await updateResource(id, req.body);
        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.status(200).json(updated);
    }

    // ── DELETE /api/files/[id] ────────────────────────────────────────────────
    if (req.method === "DELETE") {
        if (!hasPermission(role, "upload")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Not found" });

        // Remove from Cloudinary, then remove from DB
        await deleteFile(resource.publicId);
        await deleteResource(id);

        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}