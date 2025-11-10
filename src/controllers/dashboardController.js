// src/controllers/dashboardController.js
import Submission from "../models/submissionModel.js";
import mongoose from "mongoose";

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // We get the user ID from our 'protect' middleware
    const userId = req.user._id;

    // 1. Get total problems solved (we'll count unique problems later, for now just total)
    const problemsSolved = await Submission.countDocuments({ user: userId });

    // 2. Calculate weekly activity
    const today = new Date();
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));

    const submissionsLastWeek = await Submission.find({
      user: userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // Initialize a map for all 7 days of the week (Mon=1, Tue=2... Sun=0)
    const weeklyMap = new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [0, 0],
    ]);

    submissionsLastWeek.forEach((sub) => {
      const dayOfWeek = sub.createdAt.getDay();
      weeklyMap.set(dayOfWeek, (weeklyMap.get(dayOfWeek) || 0) + 1);
    });

    // Format for the chart (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
    const weeklyProgress = [
      { day: "Mon", problems: weeklyMap.get(1) },
      { day: "Tue", problems: weeklyMap.get(2) },
      { day: "Wed", problems: weeklyMap.get(3) },
      { day: "Thu", problems: weeklyMap.get(4) },
      { day: "Fri", problems: weeklyMap.get(5) },
      { day: "Sat", problems: weeklyMap.get(6) },
      { day: "Sun", problems: weeklyMap.get(0) },
    ];

    // 3. Send back the real and mock data
    const stats = {
      problemsSolved: problemsSolved,
      currentStreak: 5, // Keeping this as mock data
      rank: 12, // Keeping this as mock data
      weeklyProgress: weeklyProgress,
      nextTopic: "Dynamic Programming", // Keeping this as mock data
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getDashboardStats };
