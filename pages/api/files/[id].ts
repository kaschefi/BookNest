import type { NextApiRequest, NextApiResponse } from "next";
import {
    getResourceById,
    updateResource,
    deleteResource,
    incrementViews,
} from "../../../services/ResourceService";
import { deleteFile } from "../../../services/UploadService";
import { getApiUser } from "../../../lib/apiAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string };

    // ── GET /api/files/[id] ───────────────────────────────────────────────────
    if (req.method === "GET") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Not found" });
        // Increment view count (fire-and-forget — don't block the response)
        incrementViews(id).catch(() => {});
        return res.status(200).json(resource);
    }

    // Authenticate the user for write operations
    const user = await getApiUser(req, res);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // ── PUT /api/files/[id] ───────────────────────────────────────────────────
    if (req.method === "PUT") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Not found" });

        // Ownership and permission check
        const ownerId = resource.uploadedBy?._id?.toString() || resource.uploadedBy?.toString();
        const isOwner = ownerId === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden: You do not own this resource" });
        }

        const updated = await updateResource(id, req.body);
        if (!updated) return res.status(404).json({ message: "Not found" });
        return res.status(200).json(updated);
    }

    // ── DELETE /api/files/[id] ────────────────────────────────────────────────
    if (req.method === "DELETE") {
        const resource = await getResourceById(id);
        if (!resource) return res.status(404).json({ message: "Not found" });

        // Ownership and permission check
        const ownerId = resource.uploadedBy?._id?.toString() || resource.uploadedBy?.toString();
        const isOwner = ownerId === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden: You do not own this resource" });
        }

        // Remove from Cloudinary, then remove from DB
        await deleteFile(resource.publicId);
        await deleteResource(id);

        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}