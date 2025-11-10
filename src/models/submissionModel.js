// src/models/submissionModel.js
import mongoose from "mongoose";

const submissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Links this to the User model
    },
    // We can just store the text of the problem for now
    problemStatement: {
      type: String,
      required: true,
    },
    // We can add the user's code later if we want
    // code: {
    //   type: String,
    // },
  },
  {
    timestamps: true, // This automatically adds 'createdAt'
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
