import mongoose, { Document, Model } from "mongoose";
import argon2 from "argon2";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  ecoScore: number;
  tokensEarned: number;
  itemsUploaded: number;
  createdAt: Date;
  updatedAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [5, "Username must be at least 5 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    ecoScore: {
      type: Number,
      default: 0,
    },
    tokensEarned: {
      type: Number,
      default: 0,
    },
    itemsUploaded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if changed or new

  this.password = await argon2.hash(this.password, { type: argon2.argon2id });
  next();
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await argon2.verify(this.password, enteredPassword);
};

// Create and export User model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
