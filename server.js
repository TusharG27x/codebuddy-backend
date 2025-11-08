// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"; // 1. Import cors
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";

connectDB();

const port = process.env.PORT || 5000;
const app = express();

// 2. Add CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your React app's origin
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
