// Augment Express Request to include `user` set by auth middleware
declare namespace Express {
  interface Request {
    // IUser shape is declared in ../models/User.ts
    user?: import("../models/User").IUser | null;
  }
}
