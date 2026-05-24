import type { NextApiRequest, NextApiResponse } from "next";
import { getRoleFromRequest } from "../../middleware/auth";
import { hasPermission } from "../../lib/permissions";
import { getResources } from "../../services/ResourceService";
import { uploadFile } from "../../services/UploadService";
import { createResource } from "../../services/ResourceService";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

function getDecodedToken(req: NextApiRequest): { id: string } | null {
    const auth = req.headers.authorization;
    if (!auth) return null;
    try {
        return jwt.verify(auth.split(" ")[1], SECRET) as { id: string };
    } catch {
        return null;
    }
}

// GET  /api/files
//   ?page=1&limit=20
//   &lessonId=xxx
//   &type=midterm|final|pamphlet
//   &semester=fall|spring|summer
//   &year=2025
//   &search=calculus
//   &sortBy=newest|popular|votes
//
// POST /api/files  — upload a new resource (authenticated users only)
//   body: {
//     title, lesson, type, semester, year,
//     file: { data: "data:application/pdf;base64,...", filename: "notes.pdf" }
//   }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const role = getRoleFromRequest(req);

    // ── GET: list resources with filters + pagination ─────────────────────────
    if (req.method === "GET") {
        const { page, limit, lessonId, type, semester, year, search, sortBy } = req.query;

        const result = await getResources({
            page:     page     ? Number(page)  : 1,
            limit:    limit    ? Number(limit) : 20,
            lessonId: lessonId as string | undefined,
            type:     type     as "midterm" | "final" | "pamphlet" | undefined,
            semester: semester as "fall" | "spring" | "summer" | undefined,
            year:     year     ? Number(year)  : undefined,
            search:   search   as string | undefined,
            sortBy:   sortBy   as "newest" | "popular" | "votes" | undefined,
        });

        return res.status(200).json(result);
    }

    // ── POST: upload a new resource ───────────────────────────────────────────
    if (req.method === "POST") {
        if (!hasPermission(role, "upload")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const decoded = getDecodedToken(req);
        if (!decoded) return res.status(401).json({ message: "Unauthorized" });

        const { title, lesson, type, semester, year, file } = req.body;

        if (!title || !lesson || !type || !semester || !year || !file?.data || !file?.filename) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Upload to Cloudinary, then save metadata to DB
        const uploaded = await uploadFile(file.data, file.filename);

        const resource = await createResource({
            title,
            lesson,
            type,
            semester,
            year: Number(year),
            uploadedBy: decoded.id,
            fileUrl:  uploaded.fileUrl,
            publicId: uploaded.publicId,
            mimeType: uploaded.mimeType,
            size:     uploaded.size,
        });

        return res.status(201).json(resource);
    }

    return res.status(405).json({ message: "Method not allowed" });
}