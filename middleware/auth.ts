import { NextApiRequest, NextApiResponse } from "next";

export const authMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: Function
) => {
    const user = req.headers.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
};