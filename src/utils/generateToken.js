// src/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // 1. Create the token
  const token = jwt.sign(
    { userId }, // The data we want to store (the payload)
    process.env.JWT_SECRET, // The secret key from our .env file
    { expiresIn: "30d" } // Set it to expire in 30 days
  );

  // 2. Set the token as an httpOnly cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side script access (for security)
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;
