import User from "../models/User";
import type { Request, Response } from "express";
import { clearAuthCookieOptions, authCookieOptions } from "../utils/cookieOptions";
import { signAccessToken, signRefreshToken } from "../utils/token";

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
    res.cookie("accessToken", accessToken, authCookieOptions);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
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
      res.status(400).json({ message: "Please provide username/email and password" });
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
    res.cookie("accessToken", accessToken, authCookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
const logout = (req: Request, res: Response): void => {
  res.clearCookie("accessToken", clearAuthCookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
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
        email: user.email,
        rethinkPoints: user.rethinkPoints,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { signup, login, logout, getProfile };
