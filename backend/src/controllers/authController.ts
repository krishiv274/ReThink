import User from "../models/User";
import type { Request, Response } from "express";
import {
  accessCookieOptions,
  refreshCookieOptions,
  clearAccessCookieOptions,
  clearRefreshCookieOptions,
} from "../utils/cookieOptions";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";

// SIGNUP
const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ message: "Username or email already in use" });
      return;
    }

    const newUser = await User.create({ username, email, password });

    // Generate JWT
    const accessToken = signAccessToken(newUser._id.toString());
    const refreshToken = signRefreshToken(newUser._id.toString());

    // Set cookies
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        displayName: (newUser.displayName && newUser.displayName.trim()) || newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        itemsUploaded: newUser.itemsUploaded,
        monthlyGoal: newUser.monthlyGoal,
        monthlyCompleted: newUser.monthlyCompleted,
        totalIdeasCompleted: newUser.totalIdeasCompleted,
      },
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body as {
      identifier: string;
      password: string;
    };

    if (!identifier || !password) {
      res
        .status(400)
        .json({ message: "Please provide username/email and password" });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    // Set cookies
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        displayName: (user.displayName && user.displayName.trim()) || user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        itemsUploaded: user.itemsUploaded,
        monthlyGoal: user.monthlyGoal,
        monthlyCompleted: user.monthlyCompleted,
        totalIdeasCompleted: user.totalIdeasCompleted,
      },
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// REFRESH TOKENS
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const decoded: any = verifyRefreshToken(refreshToken);
    const userId = decoded._id;

    // Generate new tokens
    const newAccessToken = signAccessToken(userId);
    const newRefreshToken = signRefreshToken(userId);

    // Set new cookies
    res.cookie("accessToken", newAccessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// LOGOUT
const logout = (req: Request, res: Response): void => {
  res.clearCookie("accessToken", clearAccessCookieOptions);
  res.clearCookie("refreshToken", clearRefreshCookieOptions);

  res.status(200).json({ message: "Logged out" });
};

// GET PROFILE (Protected Route)
const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }
    const user = req.user;
    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        displayName: (user.displayName && user.displayName.trim()) || user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        itemsUploaded: user.itemsUploaded,
        monthlyGoal: user.monthlyGoal,
        monthlyCompleted: user.monthlyCompleted,
        totalIdeasCompleted: user.totalIdeasCompleted,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { signup, login, logout, getProfile };
