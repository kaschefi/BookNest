import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import type { Role } from "../middleware/auth";

export type ApiUser = {
    id: string;
    role: Role;
    provider?: string;
};

const SECRET = process.env.JWT_SECRET as string;

function getJwtUser(req: NextApiRequest): ApiUser | null {
    const auth = req.headers.authorization;
    if (!auth) return null;

    try {
        const decoded = jwt.verify(auth.split(" ")[1], SECRET) as {
            id?: string;
            role?: Role;
            provider?: string;
        };

        if (!decoded.id) {
            return null;
        }

        return {
            id: decoded.id,
            role: decoded.role ?? "user",
            provider: decoded.provider,
        };
    } catch {
        return null;
    }
}

export async function getApiUser(req: NextApiRequest, res: NextApiResponse): Promise<ApiUser | null> {
    const jwtUser = getJwtUser(req);
    if (jwtUser) {
        return jwtUser;
    }

    const session = await getServerSession(req, res, authOptions);
    const sessionUser = session?.user;

    if (!sessionUser?.id) {
        return null;
    }

    return {
        id: sessionUser.id,
        role: sessionUser.role ?? "user",
        provider: sessionUser.provider,
    };
}

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse): Promise<ApiUser | null> {
    const user = await getApiUser(req, res);

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return null;
    }

    if (user.role !== "admin") {
        res.status(403).json({ message: "Forbidden" });
        return null;
    }

    return user;
}
