import type { NextApiRequest, NextApiResponse } from "next";
import { castVote, getUserVote } from "../../../../services/VoteService";
import { getResourceById } from "../../../../services/ResourceService";
import { getApiUser } from "../../../../lib/apiAuth";

// This file belongs at: pages/api/files/[id]/vote.ts

// GET  /api/files/[id]/vote  — get the current user's vote
// POST /api/files/[id]/vote  — body: { value: 1 | -1 }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getApiUser(req, res);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.query as { id: string };

    const resource = await getResourceById(id);
    if (!resource) return res.status(404).json({ message: "Not found" });

    if (req.method === "GET") {
        const userVote = await getUserVote(user.id, id);
        return res.status(200).json({ userVote, voteScore: resource.voteScore });
    }

    if (req.method === "POST") {
        const { value } = req.body;
        if (value !== 1 && value !== -1) {
            return res.status(400).json({ message: "value must be 1 or -1" });
        }
        const result = await castVote(user.id, id, value as 1 | -1);
        return res.status(200).json(result);
    }

    return res.status(405).json({ message: "Method not allowed" });
}