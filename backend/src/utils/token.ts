import jwt from "jsonwebtoken";
import { config } from "../config/env";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const signAccessToken = (userId: string) => {
  return jwt.sign({ _id: userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
};
