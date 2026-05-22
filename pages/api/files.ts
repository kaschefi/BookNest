import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../lib/mongoose";
import Resource from "../../models/Resource";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Helper to resolve user ID from Authorization header, NextAuth token, or test user fallback
async function getUserId(req: NextApiRequest) {
    // 1. Check custom JWT in Authorization header
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
        const token = auth.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            if (decoded && decoded.id) {
                return decoded.id;
            }
        } catch (e) {
            console.error("[Auth] Custom JWT verification failed:", e);
        }
    }

    // 2. Check NextAuth JWT token
    try {
        const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (nextAuthToken && nextAuthToken.id) {
            return nextAuthToken.id;
        }
    } catch (e) {
        console.error("[Auth] NextAuth token parsing failed:", e);
    }

    // 3. Fallback: retrieve the first user or create a default test user
    const User = (await import("../../models/User")).default;
    let defaultUser = await User.findOne();
    if (!defaultUser) {
        defaultUser = await User.create({
            name: "Default",
            last_name: "Student",
            email: "student@booknest.com",
            role: "user"
        });
    }
    return defaultUser._id;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Enable larger payloads for file uploads
        }
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === "GET") {
        const files = await Resource.find().populate("lesson").sort({ createdAt: -1 });
        return res.json(files);
    }

    if (req.method === "POST") {
        try {
            const { title, lesson, type, fileData, fileName, mimeType, size } = req.body;

            if (!title || !lesson || !type || !fileData || !fileName) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Resolve the current user ID
            const uploadedBy = await getUserId(req);

            // Decode base64 and write file to public/uploads/
            const base64Data = fileData.replace(/^data:.*?;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            const ext = path.extname(fileName) || ".pdf";
            const cleanBase = path.basename(fileName, ext).replace(/[^\w-]/g, "");
            const uniqueName = `${Date.now()}-${cleanBase}${ext}`;

            const uploadDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, uniqueName);
            fs.writeFileSync(filePath, buffer);

            const fileUrl = `/uploads/${uniqueName}`;

            // Create Mongoose Document
            const file = await Resource.create({
                title,
                lesson,
                type, // "midterm" | "final" | "pamphlet"
                fileUrl,
                mimeType,
                size,
                uploadedBy
            });

            return res.status(201).json(file);
        } catch (error: any) {
            console.error("[Upload API] Error occurred during upload:", error);
            return res.status(500).json({ message: error.message || "Failed to process file upload" });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
}