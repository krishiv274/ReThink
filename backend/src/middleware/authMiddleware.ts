import { verifyAccessToken, verifyRefreshToken } from "../utils/token";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.status(401).json({ message: "Not authorized, no token provided" });
      return;
    }

    const decoded: any = verifyAccessToken(accessToken);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
