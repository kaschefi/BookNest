import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../../lib/apiAuth";
import { deleteUser, getUserById, updateUser } from "../../../../services/UserService";

function routeId(req: NextApiRequest) {
    const id = req.query.id;
    return Array.isArray(id) ? id[0] : id;
}

function buildUserUpdate(body: Record<string, unknown>, isSelf: boolean) {
    const update: Parameters<typeof updateUser>[1] = {};

    if (typeof body.name === "string") update.name = body.name;
    if (typeof body.last_name === "string") update.last_name = body.last_name;
    if (typeof body.student_id === "string") update.student_id = body.student_id;
    if (typeof body.field_id === "string") update.field_id = body.field_id;

    if (["guest", "user", "admin"].includes(String(body.role))) {
        if (isSelf && body.role !== "admin") {
            return { error: "Admins cannot demote their own account" };
        }

        update.role = body.role as "guest" | "user" | "admin";
    }

    return { update };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const id = routeId(req);
    if (!id) return res.status(400).json({ message: "Missing id" });

    if (req.method === "GET") {
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    }

    if (req.method === "PUT") {
        const result = buildUserUpdate(req.body, id === admin.id);
        if ("error" in result) return res.status(400).json({ message: result.error });

        const updated = await updateUser(id, result.update);
        if (!updated) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
        if (id === admin.id) {
            return res.status(400).json({ message: "Admins cannot delete their own account" });
        }

        const deleted = await deleteUser(id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
}
