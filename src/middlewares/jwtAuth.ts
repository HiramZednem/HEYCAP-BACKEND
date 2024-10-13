import { Request, Response, NextFunction } from "express";
import { jwtPlugin } from "../public/jwt-plugin";

export const accessTokenAuth = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        jwtPlugin.verify(accessToken);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid access token" });
    }
};``