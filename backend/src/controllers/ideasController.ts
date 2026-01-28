import { Request, Response } from "express";
import Item from "../models/Item";
import User from "../models/User";
import { generateReuseIdeas } from "../services/geminiService";

//
// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------
//

const authRequired = (userId: string | undefined, res: Response) => {
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return false;
  }
  return true;
};

const findItem = async (id: string, userId: string, res: Response) => {
  const item = await Item.findOne({ _id: id, userId });
  if (!item) {
    res.status(404).json({ message: "Item not found or unauthorized" });
    return null;
  }
  return item;
};

const sendServerError = (res: Response, error: unknown, message: string) => {
  console.error(message, error);
  res.status(500).json({
    message,
    error: error instanceof Error ? error.message : "Unknown error",
  });
};

//
// ------------------------------------------------------------
// Controllers
// ------------------------------------------------------------
//

/**
 * POST /api/items/:id/generate-ideas
 * Generate AI-powered reuse ideas
 */
export const generateIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!authRequired(userId, res)) return;

    const item = await findItem(id, userId!, res);
    if (!item) return;

    // If already generated
    if (item.aiAnalyzed && item.ideas.length > 0) {
      res.status(200).json({
        message: "Ideas already generated for this item",
        item: {
          _id: item._id,
          title: item.title,
          ideas: item.ideas,
          aiAnalyzed: item.aiAnalyzed,
          ideasCount: item.ideas.length,
        },
      });
      return;
    }

    // Generate new ideas
    const { ideas, difficulties, analyzed } = await generateReuseIdeas({
      imageUrl: item.imageUrl,
      title: item.title,
      material: item.material,
    });

    // Update item
    item.ideas = ideas;
    item.difficulties = difficulties;
    item.completedIdeas = Array(ideas.length).fill(false);
    item.aiAnalyzed = analyzed;
    item.ideasCount = ideas.length;

    await item.save();

    res.status(200).json({
      message: "Ideas generated successfully",
      item: {
        _id: item._id,
        title: item.title,
        material: item.material,
        ideas,
        difficulties,
        completedIdeas: item.completedIdeas,
        aiAnalyzed: analyzed,
        ideasCount: ideas.length,
      },
    });
  } catch (error) {
    sendServerError(res, error, "Failed to generate ideas");
  }
};

/**
 * GET /api/items/:id/ideas
 */
export const getIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!authRequired(userId, res)) return;

    const item = await findItem(id, userId!, res);
    if (!item) return;

    res.status(200).json({
      ideas: item.ideas,
      aiAnalyzed: item.aiAnalyzed,
      count: item.ideas.length,
    });
  } catch (error) {
    sendServerError(res, error, "Failed to fetch ideas");
  }
};

/**
 * PUT /api/items/:id/regenerate-ideas
 * Force fresh generation
 */
export const regenerateIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!authRequired(userId, res)) return;

    const item = await findItem(id, userId!, res);
    if (!item) return;

    const { ideas, difficulties, analyzed } = await generateReuseIdeas({
      imageUrl: item.imageUrl,
      title: item.title,
      material: item.material,
    });

    item.ideas = ideas;
    item.difficulties = difficulties;
    item.completedIdeas = Array(ideas.length).fill(false);
    item.aiAnalyzed = analyzed;
    item.ideasCount = ideas.length;

    await item.save();

    res.status(200).json({
      message: "Ideas regenerated successfully",
      item: {
        _id: item._id,
        title: item.title,
        ideas,
        difficulties,
        completedIdeas: item.completedIdeas,
        aiAnalyzed: analyzed,
        ideasCount: ideas.length,
      },
    });
  } catch (error) {
    sendServerError(res, error, "Failed to regenerate ideas");
  }
};

/**
 * POST /api/items/:id/generate-more-ideas
 * Append new ideas to existing ones
 */
export const generateMoreIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!authRequired(userId, res)) return;

    const item = await findItem(id, userId!, res);
    if (!item) return;

    const { ideas: newIdeas, difficulties: newDiff, analyzed } =
      await generateReuseIdeas({
        imageUrl: item.imageUrl,
        title: item.title,
        material: item.material,
      });

    item.ideas = [...item.ideas, ...newIdeas];
    item.difficulties = [...item.difficulties, ...newDiff];
    item.completedIdeas = [
      ...item.completedIdeas,
      ...Array(newIdeas.length).fill(false),
    ];
    item.aiAnalyzed = analyzed;
    item.ideasCount = item.ideas.length;

    await item.save();

    res.status(200).json({
      message: `${newIdeas.length} more ideas generated successfully`,
      item: {
        _id: item._id,
        title: item.title,
        ideas: item.ideas,
        difficulties: item.difficulties,
        completedIdeas: item.completedIdeas,
        aiAnalyzed: analyzed,
        ideasCount: item.ideas.length,
      },
      newIdeasCount: newIdeas.length,
    });
  } catch (error) {
    sendServerError(res, error, "Failed to generate more ideas");
  }
};

/**
 * POST /api/items/:id/complete-idea
 */
export const completeIdea = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { ideaIndex } = req.body;

    if (!authRequired(userId, res)) return;
    if (typeof ideaIndex !== "number" || ideaIndex < 0) {
      res.status(400).json({ message: "Invalid idea index" });
      return;
    }

    const item = await findItem(id, userId!, res);
    if (!item) return;

    if (!item.ideas || ideaIndex >= item.ideas.length) {
      res.status(400).json({ message: "Invalid idea index" });
      return;
    }

    // Initialize array if missing
    if (!item.completedIdeas?.length) {
      item.completedIdeas = Array(item.ideas.length).fill(false);
    }

    if (item.completedIdeas[ideaIndex]) {
      res.status(400).json({ message: "Idea already completed" });
      return;
    }

    const difficulty =
      item.difficulties?.[ideaIndex] ?? "Medium";

    item.completedIdeas[ideaIndex] = true;
    item.markModified("completedIdeas");

    await item.save();

    // Update user's monthly progress
    const user = await User.findById(userId);
    if (user) {
      const now = new Date();
      const lastReset = user.lastResetMonth ? new Date(user.lastResetMonth) : new Date(0);
      
      // Check if we need to reset monthly count (different month)
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        user.monthlyCompleted = 0;
        user.lastResetMonth = now;
      }
      
      // Increment counters
      user.monthlyCompleted = (user.monthlyCompleted || 0) + 1;
      user.totalIdeasCompleted = (user.totalIdeasCompleted || 0) + 1;
      
      await user.save();
    }

    res.status(200).json({
      message: "Idea marked as completed",
      difficulty,
      completed: true,
    });
  } catch (error) {
    sendServerError(res, error, "Failed to complete idea");
  }
};

export default {
  generateIdeas,
  getIdeas,
  regenerateIdeas,
  generateMoreIdeas,
  completeIdea,
};
