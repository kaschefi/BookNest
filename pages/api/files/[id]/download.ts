import type { NextApiRequest, NextApiResponse } from "next";
import { getResourceById, incrementDownloads } from "../../../../services/ResourceService";

// This file belongs at: pages/api/files/[id]/download.ts
// POST /api/files/[id]/download
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query as { id: string };
    const resource = await getResourceById(id);

    if (!resource) return res.status(404).json({ message: "Not found" });
    if (resource.status !== "approved") {
        return res.status(403).json({ message: "Resource not available" });
    }

    await incrementDownloads(id);
    return res.status(200).json({ fileUrl: resource.fileUrl });
}