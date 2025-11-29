const generateMonthlyPlanAI = require("../aiMonthlyPlan");

exports.generateMonthlyPlan = async (req, res) => {
  try {
    const { exam, examDate } = req.body;

    if (!exam || !examDate) {
      return res.status(400).json({
        success: false,
        error: "Exam and exam date are required"
      });
    }

    const plan = await generateMonthlyPlanAI(exam, examDate);

    res.json({
      success: true,
      plan
    });

  } catch (err) {
    console.error("❌ AI MONTHLY PLAN ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to generate monthly plan"
    });
  }
};
