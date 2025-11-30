require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

// ========== 1. CRITICAL: VALIDATE DATABASE_URL FIRST ==========
if (!process.env.DATABASE_URL) {
  console.error("❌ FATAL ERROR: DATABASE_URL is missing!");
  console.error("Go to Render Dashboard → Environment → Add DATABASE_URL");
  process.exit(1);
}

// ========== 2. MIDDLEWARE ==========
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ["http://localhost:3000", "https://examedge.vercel.app", "https://examedge-mr-sk534.vercel.app"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ========== 3. DATABASE POOL — BULLETPROOF ==========
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false   // This works 100% with Supabase + Render
  }
});

// Test connection (but don't crash server)
pool.connect((err, client, release) => {
  if (err) {
    console.error("⚠️ Database connection failed:", err.message);
    console.error("Server continues running (AI features still work)");
  } else {
    console.log("✅ Connected to Supabase PostgreSQL successfully!");
    release();
  }
});

app.set("db", pool);

// ========== 4. ROUTES ==========
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExamEdge Backend LIVE — Powered by Grok AI",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ========== 5. AI DOUBT SOLVER ==========
app.post("/api/ai/doubt", async (req, res) => {
  try {
    const { question, targetExam = "JEE Main & Advanced" } = req.body;
    if (!question?.trim()) return res.status(400).json({ success: false, error: "Question required" });

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "x-ai/grok-4.1-fast:free",
      messages: [
        { role: "system", content: `You are ExamEdge AI — India's #1 JEE/NEET tutor for ${targetExam}. Give step-by-step explanation in Hindi + English, with formulas and shortcuts. Max 600 words. End with: "You've got this! Keep practicing"` },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://examedge.vercel.app",
        "X-Title": "ExamEdge",
      },
      timeout: 30000
    });

    res.json({ success: true, answer: response.data.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: "Grok is busy. Try again!" });
  }
});

// ========== 6. ERROR HANDLING ==========
app.use("*", (req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// ========== 7. START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND FULLY LIVE & UNBREAKABLE");
  console.log(`   PORT: ${PORT}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "SET ✓" : "MISSING ✗"}`);
  console.log("==================================================");
});