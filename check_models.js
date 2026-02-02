import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Fetch the list
    const response = await genAI.models.list();

    // ERROR FIX: Instead of looping, we just print the raw response
    // so we can see exactly what names Google wants us to use.
    console.log("--- GOOGLE RESPONSE ---");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
