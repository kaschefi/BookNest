import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import { getAdminResources } from "../../../../services/ResourceService";

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

    const status = queryString(req.query.status);
    if (status && !["all", "pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
    }

    const type = queryString(req.query.type);
    if (type && !["midterm", "final", "pamphlet"].includes(type)) {
        return res.status(400).json({ message: "Invalid resource type filter" });
    }

    const semester = queryString(req.query.semester);
    if (semester && !["fall", "spring", "summer"].includes(semester)) {
        return res.status(400).json({ message: "Invalid semester filter" });
    }

    const sortBy = queryString(req.query.sortBy);
    if (sortBy && !["newest", "popular", "votes"].includes(sortBy)) {
        return res.status(400).json({ message: "Invalid sortBy filter" });
    }

    const result = await getAdminResources({
        page: queryNumber(req.query.page, 1),
        limit: queryNumber(req.query.limit, 20),
        lessonId: queryString(req.query.lessonId),
        type: type as "midterm" | "final" | "pamphlet" | undefined,
        status: (status ?? "all") as "all" | "pending" | "approved" | "rejected",
        semester: semester as "fall" | "spring" | "summer" | undefined,
        year: req.query.year ? Number(queryString(req.query.year)) : undefined,
        search: queryString(req.query.search),
        sortBy: (sortBy ?? "newest") as "newest" | "popular" | "votes",
    });

    return res.status(200).json(result);
}
