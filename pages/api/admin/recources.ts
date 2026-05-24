import type { NextApiRequest, NextApiResponse } from "next";
import { getRoleFromRequest } from "../../../middleware/auth";
import { getPendingResources, reviewResource } from "../../../services/ResourceService";
import { deleteFile } from "../../../services/UploadService";
import { getResourceById, deleteResource } from "../../../services/ResourceService";

// GET  /api/admin/resources          — paginated pending queue
// POST /api/admin/resources/review   — approve or reject a resource

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const role = getRoleFromRequest(req);

    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }

    // ── GET: pending queue ────────────────────────────────────────────────────
    if (req.method === "GET") {
        const { page, limit } = req.query;
        const result = await getPendingResources(
            page  ? Number(page)  : 1,
            limit ? Number(limit) : 20
        );
        return res.status(200).json(result);
    }

    // ── POST: review a resource ───────────────────────────────────────────────
    // Body: { id, status: "approved" | "rejected", reviewNote?, reviewedBy }
    if (req.method === "POST") {
        const { id, status, reviewNote, reviewedBy } = req.body;

        if (!id || !status) {
            return res.status(400).json({ message: "Missing id or status" });
        }
        if (status !== "approved" && status !== "rejected") {
            return res.status(400).json({ message: "status must be approved or rejected" });
        }

        // If rejected, delete the file from Cloudinary to save storage
        if (status === "rejected") {
            const resource = await getResourceById(id);
            if (resource) {
                await deleteFile(resource.publicId);
                await deleteResource(id);
                return res.status(200).json({ message: "Resource rejected and removed" });
            }
        }

        const updated = await reviewResource(id, reviewedBy, status, reviewNote);
        if (!updated) return res.status(404).json({ message: "Resource not found" });
        return res.status(200).json(updated);
    }

    return res.status(405).json({ message: "Method not allowed" });
}