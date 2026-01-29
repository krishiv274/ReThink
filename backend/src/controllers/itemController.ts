import Item, { Material } from "../models/Item";
import User from "../models/User";
import type { Request, Response } from "express";

// Pagination utility interface
interface PaginationResult {
  items: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * GET /api/items/me
 * Returns paginated items for the logged-in user
 * Query params: page, limit, material, sortBy (date|score)
 */
export const getMyItems = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    // Parse query parameters with defaults
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 6));
    const material = req.query.material as string;
    const sortBy = (req.query.sortBy as string) || "date";
    const search = req.query.search as string;

    // Build query filter
    const filter: any = { userId: req.user._id };

    // Add material filter if provided and not "All"
    if (material && material !== "All" && Object.values(Material).includes(material as Material)) {
      filter.material = material;
    }

    // Add search filter if provided - search both title AND material
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { material: searchRegex }
      ];
    }

    // Determine sort order
    let sortOptions: any = {};
    switch (sortBy) {
      case "ideas":
        sortOptions = { ideasCount: -1, createdAt: -1 };
        break;
      case "date":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch items
    const items = await Item.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const paginationResult: PaginationResult = {
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res.status(200).json({
      message: "Items fetched successfully",
      ...paginationResult,
    });
  } catch (error: any) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: error.message || "Failed to fetch items" });
  }
};

/**
 * POST /api/items
 * Create a new item for the logged-in user
 */
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const { title, material, imageUrl } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    if (!material || !Object.values(Material).includes(material)) {
      res.status(400).json({ 
        message: "Valid material is required. Must be one of: Plastic, Fabric, Paper, Glass, Metal, Organic" 
      });
      return;
    }

    // Create new item
    const newItem = await Item.create({
      userId: req.user._id,
      title: title.trim(),
      material,
      imageUrl: imageUrl || "",
      ideasCount: 0,
    });

    // Update user's itemsUploaded count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { itemsUploaded: 1 },
    });

    res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: error.message || "Failed to create item" });
  }
};

/**
 * PUT /api/items/:id
 * Update an existing item (only if owned by the user)
 */
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const { id } = req.params;
    const { title, material, imageUrl } = req.body;

    // Find the item and verify ownership
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Not authorized to update this item" });
      return;
    }

    // Update fields if provided
    if (title && title.trim()) {
      item.title = title.trim();
    }

    if (material && Object.values(Material).includes(material)) {
      item.material = material;
    }

    if (imageUrl !== undefined) {
      item.imageUrl = imageUrl;
    }

    await item.save();

    res.status(200).json({
      message: "Item updated successfully",
      item,
    });
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: error.message || "Failed to update item" });
  }
};

/**
 * DELETE /api/items/:id
 * Delete an item (only if owned by the user)
 */
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    const { id } = req.params;

    // Find the item and verify ownership
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Not authorized to delete this item" });
      return;
    }

    await Item.findByIdAndDelete(id);

    // Decrement user's itemsUploaded count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { itemsUploaded: -1 },
    });

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: error.message || "Failed to delete item" });
  }
};

/**
 * GET /api/items/:id
 * Get a single item by ID (public view)
 */
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate("userId", "username avatar");

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    res.status(200).json({
      message: "Item fetched successfully",
      item,
    });
  } catch (error: any) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: error.message || "Failed to fetch item" });
  }
};
