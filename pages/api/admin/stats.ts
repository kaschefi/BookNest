import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../lib/apiAuth";
import { getAdminStats } from "../../../services/AdminService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const stats = await getAdminStats();
    return res.status(200).json(stats);
}
