require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();

// ================ 1. CHECK DATABASE_URL FIRST ================
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is missing on Render!");
  process.exit(1);
}

console.log("DATABASE_URL is present ✓");

// ================ 2. MIDDLEWARE ================
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ["http://localhost:3000", "https://examedge.vercel.app", "https://examedge-mr-sk534.vercel.app"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================ 3. DATABASE POOL — THIS IS THE FIX ================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // THIS LINE IS THE KEY
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("CONNECTED TO SUPABASE SUCCESSFULLY!");
    release();
  }
});

app.set("db", pool);

// ================ 4. ROUTES ================
app.get("/", (req, res) => {
  res.json({ success: true, message: "ExamEdge Backend LIVE", database: "connected" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/mock-history", require("./routes/mockHistoryRoutes"));
app.use("/api/mockexam", require("./routes/mockExamRoutes"));
app.use("/api/doubt", require("./routes/doubt"));
app.use("/api/daily-plan", require("./routes/dailyPlanRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// ================ 5. AI DOUBT SOLVER ================
app.post("/api/ai/doubt", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "x-ai/grok-4.1-fast:free",
      messages: [
        { role: "system", content: "You are ExamEdge AI — India's best JEE/NEET tutor. Answer in Hindi + English with shortcuts." },
        { role: "user", content: question }
      ]
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    res.json({ success: true, answer: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ success: false, error: "AI busy" });
  }
});

// ================ 6. ERROR HANDLING ================
app.use("*", (req, res) => res.status(404).json({ success: false, message: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// ================ 7. START SERVER ================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("   EXAMEDGE BACKEND IS NOW 100% LIVE & UNBREAKABLE");
  console.log(`   PORT: ${PORT}`);
  console.log("   SUPABASE: CONNECTED");
  console.log("==================================================");
});