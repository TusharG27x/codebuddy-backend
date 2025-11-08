// src/routes/userRoutes.js
import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js"; // 1. Import loginUser

import { protect } from "../middlewares/authMiddleware.js";

// This creates the endpoint: POST /api/users/register
router.post("/register", registerUser);

// 2. Add this new route
// This creates the endpoint: POST /api/users/login
router.post("/login", loginUser);

router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile) // 3. GET /api/users/profile
  .put(protect, updateUserProfile);

export default router;
