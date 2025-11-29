const axios = require("axios");

module.exports = async function generateMonthlyPlan(exam, examDate) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          {
            role: "system",
            content: `You are ExamEdge AI. Create a full **monthly study plan** for ${exam}.
Break the schedule into:
- Weekly targets
- Daily tasks
- Revision days
- Test days`
          },
          {
            role: "user",
            content: `Generate a complete study plan for ${exam}. Exam date: ${examDate}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ SUPABASE MONTH ERROR:", err.response?.data || err.message);
    throw err;
  }
};
