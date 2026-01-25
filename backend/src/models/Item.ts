import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Material enum for item categorization
export enum Material {
  Plastic = "Plastic",
  Fabric = "Fabric",
  Paper = "Paper",
  Glass = "Glass",
  Metal = "Metal",
  Organic = "Organic",
  Wood = "Wood",
  Rubber = "Rubber",
  Ceramic = "Ceramic",
  Electronics = "Electronics",
}

export interface IItem extends Document {
  userId: Types.ObjectId;
  title: string;
  material: Material;
  imageUrl: string;
  ideas: string[];
  difficulties: string[];
  completedIdeas: boolean[];
  aiAnalyzed: boolean;
  ideasCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemModel extends Model<IItem> {}

const itemSchema = new Schema<IItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Index for faster queries by user
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    material: {
      type: String,
      required: [true, "Material is required"],
      enum: {
        values: Object.values(Material),
        message: "Material must be one of: Plastic, Fabric, Paper, Glass, Metal, Organic",
      },
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    ideas: {
      type: [String],
      default: [],
    },
    difficulties: {
      type: [String],
      default: [],
      enum: ['Easy', 'Medium', 'Hard', ''],
    },
    completedIdeas: {
      type: [Boolean],
      default: [],
    },
    aiAnalyzed: {
      type: Boolean,
      default: false,
    },
    ideasCount: {
      type: Number,
      default: 0,
      min: [0, "Ideas count cannot be negative"],
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient pagination queries
itemSchema.index({ userId: 1, createdAt: -1 });

const Item = mongoose.model<IItem, IItemModel>("Item", itemSchema);

export default Item;
