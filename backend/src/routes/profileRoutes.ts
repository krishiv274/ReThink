import express, { Router } from "express";
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  deleteAccount,
} from "../controllers/profileController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Protected routes (require authentication)
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.delete("/", authMiddleware, deleteAccount);

// Public route (view other user's profile)
router.get("/:id", getPublicProfile);

export default router;
