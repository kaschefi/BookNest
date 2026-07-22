import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getUserById, updateUser, deleteUser } from "../../../services/UserService";

const SECRET = process.env.JWT_SECRET as string;

function getDecodedToken(req: NextApiRequest): { id: string; role: string } | null {
    const auth = req.headers.authorization;
    if (!auth) return null;
    try {
        return jwt.verify(auth.split(" ")[1], SECRET) as { id: string; role: string };
    } catch {
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const decoded = getDecodedToken(req);
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    if (req.method === "GET") {
        const user = await getUserById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    }

    if (req.method === "PUT") {
        // Strip role — users cannot promote themselves
        const safeData = { ...req.body };
        delete safeData.role;
        const updated = await updateUser(decoded.id, safeData);
        if (!updated) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        await deleteUser(decoded.id);
        return res.status(200).json({ message: "Account deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}