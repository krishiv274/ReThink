import jwt from "jsonwebtoken";

export const signAccessToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

// Long-lived refresh token for "Remember Me" (30 days)
export const signLongRefreshToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });
};

// Password reset token (1 hour expiry)
export const signResetToken = (userId: string) => {
  return jwt.sign({ _id: userId, type: 'reset' }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "1h",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};
