const path = require("path");
const fs = require("fs");
const DailyPlan = require("../models/DailyPlan");
const Streak = require("../models/Streak");

// flatten syllabus structure
function flattenSyllabus(syllabus) {
  const list = [];
  for (const key of Object.keys(syllabus)) {
    const val = syllabus[key];

    if (Array.isArray(val)) {
      for (const topic of val) list.push({ subject: key, topic });
    } else if (typeof val === "object") {
      for (const subKey of Object.keys(val)) {
        for (const topic of val[subKey]) {
          list.push({ subject: `${key} — ${subKey}`, topic });
        }
      }
    }
  }
  return list;
}

function computePlanForToday(allTopics, examDateStr) {
  const today = new Date();
  const examDate = new Date(examDateStr);

  const daysRemaining = Math.max(
    Math.ceil((examDate - today) / 86400000),
    1
  );

  const total = allTopics.length;
  const perDay = Math.max(1, Math.ceil(total / daysRemaining));

  const slice = allTopics.slice(0, perDay);

  return {
    generated_at: new Date().toISOString(),
    total_topics: total,
    days_remaining: daysRemaining,
    today: slice.map((t, i) => ({
      id: i,
      subject: t.subject,
      topic: t.topic,
      done: false,
      time: "1h",
      difficulty: "medium"
    })),
    revision: [],
    tips: ["Revise before sleeping", "Test yourself through quizzes"]
  };
}

exports.generateDailyPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { exam, examDate } = req.body;

    if (!exam || !examDate)
      return res.status(400).json({ error: "exam and examDate required" });

    const syllabusPath = path.join(
      __dirname,
      "../data/syllabus",
      `${exam.toLowerCase()}.json`
    );

    if (!fs.existsSync(syllabusPath))
      return res.status(400).json({ error: "Syllabus not found" });

    const syllabus = JSON.parse(fs.readFileSync(syllabusPath, "utf8"));
    const allTopics = flattenSyllabus(syllabus);

    const planObj = computePlanForToday(allTopics, examDate);

    await DailyPlan.savePlan(userId, planObj);

    res.json({ success: true, plan: planObj });
  } catch (err) {
    console.error("generateDailyPlan", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTodayPlan = async (req, res) => {
  try {
    const userId = req.user?.id;

    const row = await DailyPlan.getTodayPlan(userId);

    res.json({ success: true, plan: row?.plan_json || null });
  } catch (err) {
    console.error("getTodayPlan", err);
    res.status(500).json({ error: err.message });
  }
};

exports.markTaskDone = async (req, res) => {
  try {
    const userId = req.user?.id;
    const taskIndex = Number(req.params.taskId);

    const row = await DailyPlan.getTodayPlan(userId);
    if (!row) return res.status(400).json({ error: "No plan today" });

    const plan = row.plan_json;

    if (!plan.today || !plan.today[taskIndex])
      return res.status(400).json({ error: "Invalid task index" });

    plan.today[taskIndex].done = true;

    await DailyPlan.updatePlan(userId, plan);

    const allCompleted = plan.today.every((t) => t.done);
    const streak = await Streak.updateStreak(userId, allCompleted);

    res.json({ success: true, plan, streak });
  } catch (err) {
    console.error("markTaskDone", err);
    res.status(500).json({ error: err.message });
  }
};
