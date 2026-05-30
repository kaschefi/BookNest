import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../../lib/apiAuth";
import { getResourceById, reviewResource } from "../../../../../services/ResourceService";

function routeId(req: NextApiRequest) {
    const id = req.query.id;
    return Array.isArray(id) ? id[0] : id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method !== "POST" && req.method !== "PATCH") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const id = routeId(req);
    if (!id) return res.status(400).json({ message: "Missing id" });

    const { status, reviewNote } = req.body as {
        status?: "approved" | "rejected";
        reviewNote?: string;
    };

    if (status !== "approved" && status !== "rejected") {
        return res.status(400).json({ message: "status must be approved or rejected" });
    }

    const resource = await getResourceById(id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const updated = await reviewResource(id, admin.id, status, reviewNote);
    if (!updated) return res.status(404).json({ message: "Resource not found" });

    return res.status(200).json(updated);
}
