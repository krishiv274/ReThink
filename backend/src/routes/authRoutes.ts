import express, { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getProfile,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Protected Route (requires valid JWT cookie)
router.get("/me", authMiddleware, getProfile);

export default router;
