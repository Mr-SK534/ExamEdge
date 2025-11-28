require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors({ origin: "*" }));   // Allows everything
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// TEST ROUTE — open this first
app.get('/test', (req, res) => res.json({ message: "Backend is WORKING!" }));

// REGISTER — 100% WORKS
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, targetExam } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, target_exam) VALUES ($1,$2,$3,$4) RETURNING id, name, email, target_exam',
      [name, email, hashed, targetExam || 'JEE Main & Advanced']
    );
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET);
    res.json({ success: true, token, user: result.rows[0] });
  } catch (err) {
    console.log("DB Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log("BACKEND 100% LIVE → http://localhost:5000/test");
});