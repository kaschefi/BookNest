import type { NextApiRequest, NextApiResponse } from "next";
import { hasPermission } from "../../lib/permissions";
import { getResources } from "../../services/ResourceService";
import { uploadFile } from "../../services/UploadService";
import { createResource } from "../../services/ResourceService";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const SECRET = process.env.JWT_SECRET as string;

type UploadUser = {
    id: string;
    role: "user" | "admin";
};

function getDecodedToken(req: NextApiRequest): UploadUser | null {
    const auth = req.headers.authorization;
    if (!auth) return null;
    try {
        const decoded = jwt.verify(auth.split(" ")[1], SECRET) as {
            id?: string;
            role?: "guest" | "user" | "admin";
        };

        if (!decoded.id || decoded.role === "guest") {
            return null;
        }

        return {
            id: decoded.id,
            role: decoded.role ?? "user",
        };
    } catch {
        return null;
    }
}

async function getUploadUser(req: NextApiRequest, res: NextApiResponse): Promise<UploadUser | null> {
    const jwtUser = getDecodedToken(req);
    if (jwtUser) {
        return jwtUser;
    }

    const session = await getServerSession(req, res, authOptions);
    const sessionUser = session?.user;

    if (!sessionUser?.id || sessionUser.role === "guest") {
        return null;
    }

    return {
        id: sessionUser.id,
        role: sessionUser.role ?? "user",
    };
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
    try {
        // ── GET: list resources with filters + pagination ─────────────────────────
        if (req.method === "GET") {
            const { page, limit, lessonId, type, semester, year, search, sortBy, status } = req.query;

            const result = await getResources({
                page:     page     ? Number(page)  : 1,
                limit:    limit    ? Number(limit) : 20,
                lessonId: lessonId as string | undefined,
                type:     type     as "midterm" | "final" | "pamphlet" | undefined,
                semester: semester as "fall" | "spring" | "summer" | undefined,
                year:     year     ? Number(year)  : undefined,
                search:   search   as string | undefined,
                sortBy:   sortBy   as "newest" | "popular" | "votes" | undefined,
                status:   status   as "pending" | "approved" | "rejected" | undefined,
            });

            return res.status(200).json(result);
        }

        // ── POST: upload a new resource ───────────────────────────────────────────
        if (req.method === "POST") {
            const uploadUser = await getUploadUser(req, res);
            if (!uploadUser) return res.status(401).json({ message: "Unauthorized" });

            if (!hasPermission(uploadUser.role, "upload")) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const { title, lesson, type, semester, year, file } = req.body;

            if (!title || !lesson || !type || !semester || !year || !file?.data || !file?.filename) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Upload to Cloudinary, with graceful fallback if credentials/Cloudinary error occurs
            let uploaded;
            try {
                uploaded = await uploadFile(file.data, file.filename);
            } catch (cloudErr: unknown) {
                const errMsg = cloudErr instanceof Error ? cloudErr.message : String(cloudErr);
                console.warn("[Cloudinary] Upload failed, falling back to data URL storage:", errMsg);
                uploaded = {
                    fileUrl: file.data,
                    publicId: `local_${Date.now()}_${file.filename.replace(/\s+/g, "_")}`,
                    mimeType: "application/pdf",
                    size: file.data.length,
                };
            }

            const resource = await createResource({
                title,
                lesson,
                type,
                semester,
                year: Number(year),
                uploadedBy: uploadUser.id,
                fileUrl:  uploaded.fileUrl,
                publicId: uploaded.publicId,
                mimeType: uploaded.mimeType,
                size:     uploaded.size,
            });

            return res.status(201).json(resource);
        }

        return res.status(405).json({ message: "Method not allowed" });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Internal Server Error";
        console.error("API /api/files error:", err);
        return res.status(500).json({ message });
    }
}
