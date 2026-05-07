import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export type Role = "guest" | "user" | "admin";

type DecodedToken = {
    id: string;
    role: Role;
};

export function getRoleFromRequest(req: NextApiRequest): Role {
    const auth = req.headers.authorization;

    if (!auth) return "guest";

    try {
        const token = auth.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedToken;

        return decoded.role || "guest";
    } catch {
        return "guest";
    }
}