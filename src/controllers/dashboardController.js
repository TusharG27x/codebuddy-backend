// src/controllers/dashboardController.js

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  // We have 'req.user' from our 'protect' middleware
  // In the future, we'd use req.user._id to look up real stats.

  // For now, let's return mock data for the demo.
  try {
    const stats = {
      problemsSolved: 28,
      currentStreak: 5,
      rank: 12,
      weeklyProgress: [
        { day: "Mon", problems: 2 },
        { day: "Tue", problems: 1 },
        { day: "Wed", problems: 3 },
        { day: "Thu", problems: 2 },
        { day: "Fri", problems: 4 },
        { day: "Sat", problems: 1 },
        { day: "Sun", problems: 0 },
      ],
      nextTopic: "Dynamic Programming",
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { getDashboardStats };
