// backend/server.js → FINAL & PERFECT (GROK AI + OpenRouter)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://examedge-mr-sk534.vercel.app",
    "https://examedge.vercel.app"
  ],
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/monthly-planner", require("./routes/monthlyPlannerRoutes"));



// ==================== DATABASE ====================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed", err.stack);
    process.exit(1);
  } else {
    console.log("PostgreSQL connected successfully");
  }
});

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExamEdge Backend LIVE — Powered by GROK AI",
    model: "x-ai/grok-4.1-fast:free",
    timestamp: new Date().toISOString(),
  });
});

// ==================== ROUTES ====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock", require("./routes/mock"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));




// ==================== AI DOUBT SOLVER — GROK POWERED (ONLY ONE ROUTE) ====================
app.post("/api/doubt", async (req, res) => {
  try {
    const { question, targetExam = "JEE Main & Advanced" } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ success: false, error: "Question is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4.1-fast:free",
        messages: [
          {
            role: "system",
            content: `You are ExamEdge AI — India's smartest tutor for ${targetExam}.
            Give crystal-clear, step-by-step explanations with:
            • Simple English + Hindi when helpful
            • Formulas, bullet points, text-based diagrams
            • JEE/NEET-level shortcuts & PYQ-style examples
            • End with: "You've got this! Keep practicing"
            Keep answers under 600 words but complete.`
          },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://examedge-mr-sk534.vercel.app",
          "X-Title": "ExamEdge - AI Exam Prep",
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    const answer = response.data.choices[0].message.content.trim();

    res.json({
      success: true,
      answer,
      model: "Grok-4.1-fast (Free via OpenRouter)"
    });

  } catch (err) {
    console.error("Grok AI Error:", err.response?.data || err.message);

    const errorMessage = err.response?.status === 429
      ? "Grok is busy (free tier limit). Try again in 30 seconds!"
      : "AI temporarily down. Please try again!";

    res.status(err.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
});

// ==================== 404 & ERROR HANDLER ====================
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found", path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND LIVE — POWERED BY GROK AI");
  console.log(`   http://localhost:${PORT}`);
  console.log(`   AI Model: x-ai/grok-4.1-fast:free`);
  console.log(`   Time: ${new Date().toLocaleString("en-IN")}`);
  console.log("==================================================");
});

module.exports = app;