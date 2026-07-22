import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends NextApiRequest {
    user?: string | jwt.JwtPayload;
}

export function authMiddleware(req: NextApiRequest, res: NextApiResponse) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        (req as AuthenticatedRequest).user = decoded;
        return decoded;
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return res.status(451).json({ message: "Not implemented, use sub-routes" });
}