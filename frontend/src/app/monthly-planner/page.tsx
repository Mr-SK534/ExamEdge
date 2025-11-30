"use client";

import { useState } from "react";

// THIS LINE FIXES EVERYTHING — WORKS ON VERCEL + LOCAL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MonthlyPlannerPage() {
  const [exam, setExam] = useState("JEE");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  async function generatePlan() {
    if (!examDate) {
      alert("Please select your exam date!");
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch(`${API_URL}/api/ai/generate-monthly-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          exam, 
          examDate 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPlan(data.plan);
      } else {
        alert(data.error || data.message || "Failed to generate plan");
      }
    } catch (err) {
      console.error("Monthly plan error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function downloadPlan() {
    if (!plan) return;

    const blob = new Blob([plan], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExamEdge_Monthly_Plan_${exam}_${examDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/20">

        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-12 drop-shadow-2xl">
          Monthly Planner Pro
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6">
            <div>
              <label className="text-lg font-bold text-cyan-300">Target Exam</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full mt-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-lg focus:border-cyan-400 focus:outline-none transition"
              >
                <option value="JEE">JEE Main + Advanced</option>
                <option value="NEET">NEET</option>
                <option value="VITEEE">VITEEE</option>
                <option value="BITSAT">BITSAT</option>
              </select>
            </div>

            <div>
              <label className="text-lg font-bold text-cyan-300">Your Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full mt-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-lg focus:border-cyan-400 focus:outline-none transition"
                required
              />
            </div>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xl rounded-xl shadow-xl transform hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating Your Master Plan..." : "Generate Monthly Plan"}
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Pro Features</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center gap-3">✦ Perfect chapter sequencing</li>
              <li className="flex items-center gap-3">✦ High-weightage topics first</li>
              <li className="flex items-center gap-3">✦ Built-in revision weeks</li>
              <li className="flex items-center gap-3">✦ Mock test schedule</li>
              <li className="flex items-center gap-3">✦ Zero syllabus gap</li>
            </ul>
          </div>
        </div>

        {plan && (
          <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cyan-300">Your Personalized Monthly Plan</h2>
              <button
                onClick={downloadPlan}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                Download Plan
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-100 text-lg leading-relaxed font-mono bg-black/30 p-6 rounded-xl border border-white/10">
              {plan}
            </pre>
          </div>
        )}

        {!plan && !loading && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Your AI-powered monthly strategy will appear here</p>
            <p className="text-cyan-300 mt-4">Made specifically for YOUR exam date</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <p className="text-3xl text-cyan-300 animate-pulse">Grok is creating your perfect plan...</p>
          </div>
        )}
      </div>
    </div>
  );
}