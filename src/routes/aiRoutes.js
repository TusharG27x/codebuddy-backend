// src/routes/aiRoutes.js
import express from "express";
const router = express.Router();
import { getCodeHint, analyzeComplexity } from "../controllers/aiController.js"; // <-- Updated import
import { protect } from "../middlewares/authMiddleware.js";

// This is our main hint endpoint
router.route("/get-hint").post(protect, getCodeHint);

// --- NEW ROUTE: Complexity Analyzer ---
router.route("/analyze-complexity").post(protect, analyzeComplexity);

export default router;
