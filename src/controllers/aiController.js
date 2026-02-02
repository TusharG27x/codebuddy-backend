// src/controllers/aiController.js
import { GoogleGenAI } from "@google/genai";
import Submission from "../models/submissionModel.js";

// @desc    Generate a code hint
// @route   POST /api/ai/get-hint
// @access  Private
const getCodeHint = async (req, res) => {
  try {
    // --- 1. Initialize the AI client ---
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const { code, problem } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required." });
    }

    // --- 2. YOUR EXACT ORIGINAL PROMPT ---
    const prompt = `
      You are CodeBuddy, an expert AI coding assistant.
      Your goal is to help users learn by providing hints, NOT full solutions.
      A user is stuck on the following problem:
      
      Problem: """
      ${problem || "No problem statement provided."}
      """

      Here is their current code:
      Code: \`\`\`
      ${code}
      \`\`\`

      Please analyze the code in the context of the problem.
      - **Do NOT** provide the complete, corrected code.
      - **DO** provide a single, small, actionable hint.
      - **CRITICAL RULE:** If the code is a mix of different languages (e.g., Python and Java) or is too jumbled to be analyzed, your hint should be to gently point that out. For example: "It looks like you're mixing syntax from a few different languages! Try sticking to one language."
      - Keep your hint to 1-2 sentences.
      - Be encouraging!
    `;

    // --- 3. THE FIX: Using "Flash-Lite" which has a free tier ---
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // --- 4. Get the hint ---
    // Using the safe access method (optional chaining) to prevent crashes
    const hint = result.candidates?.[0]?.content?.parts?.[0]?.text;

    await Submission.create({
      user: req.user._id,
      problemStatement: problem || "Untitled Problem",
    });

    res.status(200).json({ hint: hint });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res
      .status(500)
      .json({ message: "Error generating hint from AI: " + error.message });
  }
};

export { getCodeHint };
