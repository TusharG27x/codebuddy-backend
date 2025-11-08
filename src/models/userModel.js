// src/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "A passionate CodeBuddy user!",
    },
  },
  {
    timestamps: true,
  }
);

// THIS IS THE CORRECTED PRE-SAVE FUNCTION
userSchema.pre("save", async function (next) {
  // If the password field isn't being modified, just move on
  console.log("--- 2. HIT PRE-SAVE HOOK ---");
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // This tells Mongoose to continue the 'save' operation
  } catch (error) {
    next(error); // Pass any errors to Mongoose
  }
});

// This method compares passwords for logging in
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
