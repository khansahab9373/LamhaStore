import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Token generation

export const generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    throw new Error("Error generating token");
  }
};
// Token verification

export const verifyToken = (token)=>{
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Error verifying token");
    }
}