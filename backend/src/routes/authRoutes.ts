import express, { Router } from "express";
import passport from "../config/passport";
import {
  signup,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  googleCallback,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    session: false 
  }),
  googleCallback
);

// Protected Route (requires valid JWT cookie)
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);

export default router;
