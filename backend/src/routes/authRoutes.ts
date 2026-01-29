import express, { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getProfile,
} from "../controllers/authController";
import { googleAuth } from "../controllers/googleAuthController";
import { forgotPassword, resetPassword } from "../controllers/passwordController";

import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Google OAuth
router.post("/google", googleAuth);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected Route (requires valid JWT cookie)
router.get("/me", authMiddleware, getProfile);

export default router;
