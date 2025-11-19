import express, { Router } from "express";
import { signup, login, logout, getProfile } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected Route (requires valid JWT cookie)
router.get("/me", protect, getProfile);

export default router;
