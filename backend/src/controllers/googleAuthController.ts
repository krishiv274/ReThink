import User from "../models/User";
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/cookieOptions";
import { signAccessToken, signRefreshToken } from "../utils/token";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate username from email
const generateUsername = (email: string): string => {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}_${suffix}`.substring(0, 20);
};

// Google user info response type
interface GoogleUserInfo {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

// Fetch user info from Google using access token
const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch user info from Google");
  }
  
  return response.json() as Promise<GoogleUserInfo>;
};

// GOOGLE AUTH - supports both access_token (implicit flow) and credential (ID token)
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential, access_token } = req.body as { credential?: string; access_token?: string };

    let email: string;
    let googleId: string;
    let name: string | undefined;
    let picture: string | undefined;

    if (access_token) {
      // Handle access token from useGoogleLogin (implicit flow)
      const userInfo = await fetchGoogleUserInfo(access_token);
      email = userInfo.email;
      googleId = userInfo.sub;
      name = userInfo.name;
      picture = userInfo.picture;
    } else if (credential) {
      // Handle ID token from GoogleLogin component
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        res.status(400).json({ message: "Invalid Google token" });
        return;
      }

      email = payload.email;
      googleId = payload.sub!;
      name = payload.name;
      picture = payload.picture;
    } else {
      res.status(400).json({ message: "Google credential or access_token is required" });
      return;
    }

    // Check if user exists by email or googleId
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      // User exists - link Google if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      const username = generateUsername(email);
      user = await User.create({
        username,
        displayName: name || username,
        email,
        googleId,
        authProvider: 'google',
        avatar: picture || '',
      });
    }

    // Generate tokens
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    // Set cookies
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({
      message: "Google authentication successful",
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
        authProvider: user.authProvider,
      },
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};
