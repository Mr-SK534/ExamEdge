-- database/schema.sql
-- ExamEdge Complete Database Schema
-- PostgreSQL / Supabase Ready | Multi-Exam Supported (JEE, NEET, WBJEE, CUET, BITSAT, etc.)

-- Enable UUID extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- 1. Users
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id            TEXT      PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT      NOT NULL,
    email         TEXT      UNIQUE NOT NULL,
    phone         TEXT      UNIQUE,
    password      TEXT      NOT NULL,
    avatar        TEXT      DEFAULT 'https://ui-avatars.com/api/?background=10b981&color=fff&name=User',
    exam          TEXT      DEFAULT 'JEE' CHECK (exam IN ('JEE', 'NEET', 'WBJEE', 'CUET', 'BITSAT', 'VITEEE', 'MHT-CET', 'KCET', 'SRMJEEE', 'UPSC', 'NDA', 'OTHER')),
    target_year   INTEGER   DEFAULT 2026,
    role          TEXT      DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'MODERATOR')),
    is_verified   BOOLEAN   DEFAULT FALSE,
    streak        INTEGER   DEFAULT 0,
    xp            INTEGER   DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. Mock Test History
-- ========================================
CREATE TABLE IF NOT EXISTS test_history (
    id             TEXT      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        TEXT      REFERENCES users(id) ON DELETE CASCADE,
    test_name      TEXT      NOT NULL,
    subject        TEXT,
    total_marks    INTEGER   NOT NULL,
    scored_marks   INTEGER   NOT NULL,
    accuracy       FLOAT     NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
    time_taken     INTEGER   NOT NULL, -- seconds
    attempted      INTEGER   DEFAULT 0,
    correct        INTEGER   DEFAULT 0,
    wrong          INTEGER   DEFAULT 0,
    skipped        INTEGER   DEFAULT 0,
    started_at     TIMESTAMPTZ,
    submitted_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. Weak Topics (AI Detected)
-- ========================================
CREATE TABLE IF NOT EXISTS weak_topics (
    id         TEXT    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    TEXT    REFERENCES users(id) ON DELETE CASCADE,
    chapter    TEXT    NOT NULL,
    subject    TEXT    NOT NULL,
    accuracy   FLOAT   DEFAULT 0,
    attempts   INTEGER DEFAULT 0,
    priority   INTEGER DEFAULT 1 CHECK (priority IN (1,2,3)),
    UNIQUE(user_id, chapter, subject)
);

-- ========================================
-- 4. AI Doubt Solver
-- ========================================
CREATE TABLE IF NOT EXISTS doubts (
    id          TEXT      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT      REFERENCES users(id) ON DELETE CASCADE,
    question    TEXT      NOT NULL,
    image_url   TEXT,
    answer      TEXT,
    explained   BOOLEAN   DEFAULT FALSE,
    asked_at    TIMESTAMPTZ DEFAULT NOW(),
    answered_at TIMESTAMPTZ
);

-- ========================================
-- 5. Daily AI Study Plan
-- ========================================
CREATE TABLE IF NOT EXISTS study_plans (
    id         TEXT      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    TEXT      REFERENCES users(id) ON DELETE CASCADE,
    date       DATE      NOT NULL,
    tasks      JSONB     DEFAULT '[]'::jsonb,
    completed  BOOLEAN   DEFAULT FALSE,
    UNIQUE(user_id, date)
);

-- ========================================
-- 6. Daily Progress & Gamification
-- ========================================
CREATE TABLE IF NOT EXISTS daily_progress (
    id               TEXT      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          TEXT      REFERENCES users(id) ON DELETE CASCADE,
    date             DATE      NOT NULL UNIQUE,
    minutes_studied  INTEGER   DEFAULT 0,
    questions_done   INTEGER   DEFAULT 0,
    xp_earned        INTEGER   DEFAULT 0
);

-- ========================================
-- Indexes for Speed (Very Important!)
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_test_history_user ON test_history(user_id);
CREATE INDEX IF NOT EXISTS idx_weak_topics_user ON weak_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_doubts_user ON doubts(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_user_date ON study_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);

-- Optional: Enable RLS for Supabase (uncomment when ready)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_history ENABLE ROW LEVEL SECURITY;
-- etc.