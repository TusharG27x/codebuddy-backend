// src/controllers/userController.js
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  console.log("--- 1. HIT REGISTER CONTROLLER ---"); // Debug log

  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    console.log("--- 1a. ABOUT TO CREATE USER ---"); // Another debug log

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("--- 1b. USER CREATED ---"); // Another debug log

    if (user) {
      // We'll generate a token on register too, so they are logged in right away
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("--- REGISTER ERROR ---", error); // Log the error
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Login successful!",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const logoutUser = async (req, res) => {
  // We clear the cookie by setting it to an empty string
  // and making it expire immediately.
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// ... (imports and other functions are above) ...

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (needs token)
const getUserProfile = async (req, res) => {
  // req.user is attached by our 'protect' middleware
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio, // We'll add this field to the model soon
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (needs token)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update the fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio; // For the profile page

    // We can add logic to update password if req.body.password exists

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// --- Make sure to export the new functions ---
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
