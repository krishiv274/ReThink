import express, { Router } from "express";
import {
  getMyItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById,
} from "../controllers/itemController";
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

// Public route - Get single item by ID
router.get("/:id", getItemById);

export default router;
