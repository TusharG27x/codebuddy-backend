// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // 1. Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get the user from the DB (using the ID from the token)
      // We attach the user to the request object
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Move on to the next function (the controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { protect };
