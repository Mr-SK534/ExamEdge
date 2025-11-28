const axios = require("axios");

// AI doubt solver using OpenRouter
exports.solveDoubt = async (req, res) => {
  try {
    const { question, context, reasoning } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    const systemPrompt = `
You are an expert AI tutor for JEE/NEET/BITSAT/WBJEE/NDA.
Explain concepts simply, step-by-step, and give examples.
If a student asks for steps, give detailed reasoning.
`;

    const userPrompt = `
Question: ${question}

Additional context (optional):
${context || "None"}

Show step-by-step reasoning: ${reasoning ? "YES" : "NO"}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const answer =
      response.data?.choices?.[0]?.message?.content ||
      "AI did not return an answer.";

    return res.json({
      success: true,
      answer,
    });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      error: "AI service failed. Try again later.",
      detail: err.response?.data || err.message,
    });
  }
};
