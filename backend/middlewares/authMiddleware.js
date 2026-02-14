import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next(); // 🔥 IMPORTANT
    } catch (error) {
      console.error("JWT ERROR:", error.message);
      return res
        .status(401)
        .json({ message: "Not authorized, token failed" });
    }
  }

  return res
    .status(401)
    .json({ message: "Not authorized, no token" });
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized as an admin" });
  }
};
