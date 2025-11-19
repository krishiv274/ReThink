import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return val;
};

export const config = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: getEnv("MONGO_URI"),
  NODE_ENV: (process.env.NODE_ENV as "development" | "production") || "development",

  // jwt-specific
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
