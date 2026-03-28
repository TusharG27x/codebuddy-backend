// src/controllers/codeController.js
import axios from "axios";

// @desc    Execute user code via JDoodle
// @route   POST /api/code/execute
// @access  Private
const executeCode = async (req, res) => {
  const { code, language = "python" } = req.body;

  if (!code) {
    return res.status(400).json({ message: "No code provided to execute." });
  }

  // 1. Map our frontend languages to JDoodle's specific compiler codes
  const languageMap = {
    python: { lang: "python3", versionIndex: "3" },
    javascript: { lang: "nodejs", versionIndex: "3" },
    java: { lang: "java", versionIndex: "4" },
    cpp: { lang: "cpp17", versionIndex: "0" },
  };

  // Default to Python if something goes wrong
  const selectedConfig = languageMap[language] || languageMap["python"];

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: selectedConfig.lang,
      versionIndex: selectedConfig.versionIndex,
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    });

    res.status(200).json({ output: response.data.output });
  } catch (error) {
    console.error(
      "JDoodle Execution Error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ message: "Failed to execute code on the server." });
  }
};

export { executeCode };
