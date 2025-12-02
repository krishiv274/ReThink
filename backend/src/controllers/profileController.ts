import User from "../models/User";
import type { Request, Response } from "express";

// GET PROFILE (Protected Route)
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        ecoScore: user.ecoScore,
        tokensEarned: user.tokensEarned,
        itemsUploaded: user.itemsUploaded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE (Protected Route)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const { username, avatar, bio } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      user.username = username;
    }

    // Update fields if provided
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        ecoScore: user.ecoScore,
        tokensEarned: user.tokensEarned,
        itemsUploaded: user.itemsUploaded,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET PUBLIC PROFILE (for viewing other users - e.g., leaderboard)
export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -email");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Public profile fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        ecoScore: user.ecoScore,
        tokensEarned: user.tokensEarned,
        itemsUploaded: user.itemsUploaded,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ACCOUNT (Protected Route)
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const userId = req.user._id;

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
