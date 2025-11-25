import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export const accessCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/",
  maxAge: 15 * 60 * 1000,          // 15 minutes
};

export const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/api/auth/refresh",           
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const clearAccessCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/",
};

export const clearRefreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  path: "/api/auth/refresh",
};
