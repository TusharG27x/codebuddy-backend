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

// --- NEW FEATURE: Code Complexity Analyzer ---
// @desc    Analyze code time and space complexity
// @route   POST /api/ai/analyze-complexity
// @access  Private
const analyzeComplexity = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || code === "// Write your code here...") {
      return res
        .status(400)
        .json({ message: "Please provide valid code to analyze." });
    }

    // Initialize the AI client using your existing setup
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Strict prompt engineering to force the AI into a specific output format
    const prompt = `
      You are an expert Computer Science professor. Analyze the following ${language || "programming"} code.
      Calculate its Big O Time Complexity and Space Complexity.
      
      You MUST respond in EXACTLY this format, with no extra markdown or introductory text:
      Time: O(...)
      Space: O(...)
      Explanation: (Provide a 1-2 sentence explanation of why).

      Code to analyze:
      ${code}
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const analysisText =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Time: Unknown\nSpace: Unknown\nExplanation: Could not generate analysis.";

    res.status(200).json({ analysis: analysisText });
  } catch (error) {
    console.error("Complexity Analysis Error:", error);
    res
      .status(500)
      .json({ message: "Failed to analyze code complexity: " + error.message });
  }
};

// --- UPDATED: Exporting both functions ---
export { getCodeHint, analyzeComplexity };
