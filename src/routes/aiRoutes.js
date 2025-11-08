// src/routes/aiRoutes.js
import express from "express";
const router = express.Router();
import { getCodeHint } from "../controllers/aiController.js"; // 1. Only import getCodeHint
import { protect } from "../middlewares/authMiddleware.js";

// This is our main hint endpoint
router.route("/get-hint").post(protect, getCodeHint);

// 2. The test route is gone
export default router;
