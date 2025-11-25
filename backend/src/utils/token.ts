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

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};
