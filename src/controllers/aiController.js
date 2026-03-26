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

    // --- 2. UPDATED PROMPT: Added Correctness Check ---
    const prompt = `
      You are CodeBuddy, an expert AI coding assistant.
      A user has submitted code for the following problem:
      
      Problem: """
      ${problem || "No problem statement provided."}
      """

      Here is their current code:
      Code: \`\`\`
      ${code}
      \`\`\`

      Please analyze the code in the context of the problem and strictly follow these rules:
      
      1. **CHECK FOR CORRECTNESS:** First, evaluate if the code perfectly and efficiently solves the problem without any syntax or logic errors.
      2. **IF THE CODE IS CORRECT:** If the code is 100% correct, has no syntax errors, and solves the logic, your response must start with "✅ Correct!" Congratulate the user and briefly state why their approach works. Do NOT give any further hints.
      3. **IF THE CODE IS INCORRECT OR INCOMPLETE:** Your goal is to help them learn by providing hints, NOT full solutions.
         - **Do NOT** provide the complete, corrected code.
         - **DO** provide a single, small, actionable hint to guide them.
         - **CRITICAL RULE:** If the code is a mix of different languages (e.g., Python and Java) or is too jumbled to be analyzed, gently point that out (e.g., "It looks like you're mixing syntax from a few different languages! Try sticking to one.").
      
      Keep your overall response to 1-3 sentences and always remain encouraging!
    `;

    // --- 3. Use "gemini-flash-latest" ---
    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // --- 4. Get the hint ---
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
