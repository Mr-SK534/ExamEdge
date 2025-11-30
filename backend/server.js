require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

// ============================================
// 1. VALIDATE REQUIRED ENV VARS
// ============================================
if (!process.env.DATABASE_URL || !process.env.OPENROUTER_API_KEY) {
  console.error("❌ MISSING DATABASE_URL or OPENROUTER_API_KEY");
  process.exit(1);
}

// ============================================
// 2. MIDDLEWARE
// ============================================
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: ["http://localhost:3000", "https://examedge-mr-sk534.vercel.app", "https://examedge.vercel.app"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// 3. DATABASE — BULLETPROOF (ONLY ONE POOL!)
// ============================================
let pool = null;

try {
  const { Pool } = require("pg");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.on('connect', () => console.log("✅ PostgreSQL connected successfully"));
  pool.on('error', (err) => console.error("⚠️ Pool error:", err.message));

} catch (err) {
  console.error("❌ Failed to create database pool:", err.message);
}

// Share with routes
app.set("db", pool);

// ============================================
// 4. ROUTES
// ============================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExamEdge Backend LIVE — Powered by GROK AI",
    database: pool ? "connected" : "offline",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => res.json({ status: "OK" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ============================================
// 5. AI DOUBT SOLVER
// ============================================
app.post("/api/ai/doubt", async (req, res) => {
  try {
    const { question, targetExam = "JEE Main & Advanced" } = req.body;
    if (!question?.trim()) return res.status(400).json({ success: false, error: "Question required" });

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "x-ai/grok-4.1-fast:free",
      messages: [
        { role: "system", content: `You are ExamEdge AI — India's #1 tutor for ${targetExam}.\n• Step-by-step explanation\n• Hindi + English\n• Formulas + ASCII diagrams\n• JEE/NEET shortcuts\n• Max 600 words\n• End with: "You've got this! Keep practicing"` },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://examedge-mr-sk534.vercel.app",
        "X-Title": "ExamEdge",
        "Content-Type": "application/json"
      },
      timeout: 30000
    });

    res.json({ success: true, answer: response.data.choices[0].message.content.trim() });

  } catch (err) {
    res.status(500).json({ success: false, error: "Grok is busy. Try again!" });
  }
});

// ============================================
// 6. ERROR HANDLING
// ============================================
app.use("*", (req, res) => res.status(404).json({ success: false, message: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// ============================================
// 7. START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND IS NOW LIVE & UNBREAKABLE");
  console.log(`   PORT: ${PORT}`);
  console.log(`   DATABASE: ${pool ? "CONNECTED" : "OFFLINE"}`);
  console.log("==================================================");
});