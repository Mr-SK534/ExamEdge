require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();

// ============================================
// 🔴 ENVIRONMENT VARIABLES VALIDATION
// ============================================
const requiredEnvVars = ["DATABASE_URL", "OPENROUTER_API_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("==================================================");
  console.error("❌ MISSING ENVIRONMENT VARIABLES:");
  missingVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("==================================================");
  console.error("Please set these in Render Dashboard → Environment tab");
  console.error("==================================================");
  process.exit(1);
}

// ============================================
// MIDDLEWARE
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://examedge-mr-sk534.vercel.app",
      "https://examedge.vercel.app",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// 🗄️ DATABASE CONNECTION
// ============================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Make pool accessible to routes
app.set("db", pool);

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("==================================================");
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error("Error:", err.message);
    console.error("==================================================");
    console.error("Check your DATABASE_URL format:");
    console.error("postgresql://username:password@host:5432/database?sslmode=require");
    console.error("==================================================");
    process.exit(1);
  } else {
    release();
    console.log("✅ PostgreSQL connected successfully");
  }
});

// ============================================
// ROUTES
// ============================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExamEdge Backend LIVE — Powered by GROK AI",
    model: "x-ai/grok-4.1-fast:free",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ============================================
// AI DOUBT SOLVER ENDPOINT
// ============================================
app.post("/api/ai/doubt", async (req, res) => {
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
            content: `
              You are ExamEdge AI — India's smartest tutor for ${targetExam}.
              Provide:
              • Clear step-by-step explanation
              • Hindi support  
              • Formulas + diagrams (ASCII)
              • JEE/NEET shortcuts
              • max 600 words  
              • End with: "You've got this! Keep practicing"
            `,
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://examedge-mr-sk534.vercel.app",
          "X-Title": "ExamEdge - AI Exam Prep",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const answer = response.data.choices[0].message.content.trim();

    res.json({ success: true, answer, model: "Grok-4.1-fast" });
  } catch (err) {
    console.error("Grok AI Error:", err.response?.data || err.message);

    res.status(err.response?.status || 500).json({
      success: false,
      error:
        err.response?.status === 429
          ? "Grok is busy. Try again later!"
          : "AI temporarily down. Try again!",
    });
  }
});

// ============================================
// 404 HANDLER
// ============================================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   ✅ EXAMEDGE BACKEND LIVE — POWERED BY GROK AI");
  console.log(`   🌐 Port: ${PORT}`);
  console.log(`   📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("==================================================");
});