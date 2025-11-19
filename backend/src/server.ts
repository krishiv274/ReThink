import express from "express";
import cors from "cors";
import { config } from "./config/env";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.get("/api/health", (req, res) => {
  res.send("ReTh!nk API is up and running!");
});
app.use("/api/auth", authRoutes);

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
