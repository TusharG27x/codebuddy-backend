// src/routes/dashboardRoutes.js
import express from "express";
const router = express.Router();
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

// This will be the endpoint: GET /api/dashboard/stats
router.route("/stats").get(protect, getDashboardStats);

export default router;
