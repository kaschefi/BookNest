import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import { getUsers } from "../../../../services/UserService";

function queryString(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function queryNumber(value: string | string[] | undefined, fallback: number) {
    const parsed = Number(queryString(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const role = queryString(req.query.role);
    if (role && !["all", "guest", "user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role filter" });
    }

    const result = await getUsers({
        search: queryString(req.query.search),
        role: (role ?? "all") as "all" | "guest" | "user" | "admin",
        page: queryNumber(req.query.page, 1),
        limit: queryNumber(req.query.limit, 20),
    });

    return res.status(200).json(result);
}
