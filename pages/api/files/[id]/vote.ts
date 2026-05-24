import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { castVote, getUserVote } from "../../../../services/VoteService";
import { getResourceById } from "../../../../services/ResourceService";

// This file belongs at: pages/api/files/[id]/vote.ts

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

// GET  /api/files/[id]/vote  — get the current user's vote
// POST /api/files/[id]/vote  — body: { value: 1 | -1 }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const decoded = getDecodedToken(req);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.query as { id: string };

    const resource = await getResourceById(id);
    if (!resource) return res.status(404).json({ message: "Not found" });

    if (req.method === "GET") {
        const userVote = await getUserVote(decoded.id, id);
        return res.status(200).json({ userVote, voteScore: resource.voteScore });
    }

    if (req.method === "POST") {
        const { value } = req.body;
        if (value !== 1 && value !== -1) {
            return res.status(400).json({ message: "value must be 1 or -1" });
        }
        const result = await castVote(decoded.id, id, value as 1 | -1);
        return res.status(200).json(result);
    }

    return res.status(405).json({ message: "Method not allowed" });
}