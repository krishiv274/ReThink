import type { CookieOptions } from "express";
import { config } from "../config/env";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const authCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearAuthCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 0,
};
