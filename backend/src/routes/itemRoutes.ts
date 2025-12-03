import express, { Router } from "express";
import {
  getMyItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
} from "../controllers/itemController";
import {
  generateIdeas,
  getIdeas,
  regenerateIdeas,
  generateMoreIdeas,
  completeIdea,
} from "../controllers/ideasController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Protected routes (require authentication via JWT cookie)
// GET /api/items/me - Get paginated items for logged-in user
router.get("/me", authMiddleware, getMyItems);

// POST /api/items - Create a new item
router.post("/", authMiddleware, createItem);

// PUT /api/items/:id - Update an item
router.put("/:id", authMiddleware, updateItem);

// DELETE /api/items/:id - Delete an item
router.delete("/:id", authMiddleware, deleteItem);

// AI Ideas routes
// POST /api/items/:id/generate-ideas - Generate AI ideas for an item
router.post("/:id/generate-ideas", authMiddleware, generateIdeas);

// GET /api/items/:id/ideas - Get ideas for an item
router.get("/:id/ideas", authMiddleware, getIdeas);

// PUT /api/items/:id/regenerate-ideas - Regenerate ideas for an item
router.put("/:id/regenerate-ideas", authMiddleware, regenerateIdeas);

// POST /api/items/:id/generate-more-ideas - Generate 5 more ideas and append
router.post("/:id/generate-more-ideas", authMiddleware, generateMoreIdeas);

// POST /api/items/:id/complete-idea - Mark an idea as completed and award points
router.post("/:id/complete-idea", authMiddleware, completeIdea);

// Public route - Get single item by ID
router.get("/:id", getItemById);

export default router;
