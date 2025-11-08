// src/controllers/aiController.js
import { GoogleGenAI } from "@google/genai"; // This import is correct

// @desc    Generate a code hint
// @route   POST /api/ai/get-hint
// @access  Private
const getCodeHint = async (req, res) => {
  try {
    // --- 1. Initialize the AI client ---
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

    const { code, problem } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required." });
    }

    // --- 2. This is our full, correct prompt ---
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
      - Keep your hint to 1-2 sentences.
      - Be encouraging!
    `;

    // --- 3. This is the correct API call ---
    const result = await genAI.models.generateContent({
      model: "gemini-pro-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // --- 4. THIS IS THE FINAL, CORRECTED CODE ---
    // We get the hint from the path we found in your log
    const hint = result.candidates[0].content.parts[0].text;

    res.status(200).json({ hint: hint });
    // ----------------------------------------
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Error generating hint from AI." });
  }
};

export { getCodeHint };
