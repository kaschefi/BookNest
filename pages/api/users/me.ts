import type { NextApiRequest, NextApiResponse } from "next";
import { getApiUser } from "@/lib/apiAuth";
import { getUserById, updateUser, deleteUser } from "@/services/UserService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userAuth = await getApiUser(req, res);
    if (!userAuth) return res.status(401).json({ message: "Unauthorized" });

    if (req.method === "GET") {
        const user = await getUserById(userAuth.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    }

    if (req.method === "PUT") {
        // Strip role — users cannot promote themselves
        const safeData = { ...req.body };
        delete safeData.role;
        const updated = await updateUser(userAuth.id, safeData);
        if (!updated) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        await deleteUser(userAuth.id);
        return res.status(200).json({ message: "Account deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}