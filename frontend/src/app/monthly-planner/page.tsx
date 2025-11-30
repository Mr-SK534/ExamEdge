"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MonthlyPlannerPage() {
  const [exam, setExam] = useState("JEE");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    setToken(t);

    if (!t) {
      alert("⚠️ Please login first to generate your monthly plan!");
    }
  }, []);

  async function generatePlan() {
    if (!examDate) {
      alert("Please select your exam date!");
      return;
    }

    if (!token) {
      alert("You must be logged in!");
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch(`${API_URL}/api/ai/generate-monthly-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
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
        alert(data.message || data.error || "Failed to generate plan");
      }
    } catch (err) {
      console.error("Monthly plan error:", err);
      alert("Server busy. Try again in 10 seconds.");
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
    a.download = `ExamEdge_Monthly_Plan_${exam}_${examDate.replace(/-/g, "")}.txt`;
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
                <option value="JEE" className="bg-gray-900 text-white">JEE Main + Advanced</option>
                <option value="NEET" className="bg-gray-900 text-white">NEET</option>
                <option value="VITEEE" className="bg-gray-900 text-white">VITEEE</option>
                <option value="BITSAT" className="bg-gray-900 text-white">BITSAT</option>
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
              disabled={loading || !token}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xl rounded-xl shadow-xl transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Generating Your Master Plan..." : "Generate Monthly Plan"}
            </button>

            {!token && (
              <p className="text-center text-yellow-400 text-sm mt-4">
                🔒 Login required to generate plan
              </p>
            )}
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Pro Features Included</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center gap-3">✦ Perfect chapter sequencing</li>
              <li className="flex items-center gap-3">✦ High-weightage topics first</li>
              <li className="flex items-center gap-3">✦ Built-in revision weeks</li>
              <li className="flex items-center gap-3">✦ Mock test schedule</li>
              <li className="flex items-center gap-3">✦ Zero syllabus gap</li>
              <li className="flex items-center gap-3">✦ Made for YOUR exact exam date</li>
            </ul>
          </div>
        </div>

        {plan && (
          <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-cyan-300">Your Personalized Monthly Plan</h2>
              <button
                onClick={downloadPlan}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                📥 Download Plan
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-100 text-lg leading-relaxed font-mono bg-black/30 p-8 rounded-xl border border-white/10 shadow-inner">
              {plan}
            </pre>
          </div>
        )}

        {!plan && !loading && !token && (
          <div className="text-center py-20">
            <p className="text-3xl text-red-400 mb-4">🔒 Login Required</p>
            <p className="text-xl text-gray-400">Please login to generate your personalized monthly plan</p>
          </div>
        )}

        {!plan && !loading && token && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Your AI-powered monthly strategy will appear here</p>
            <p className="text-cyan-300 mt-4">Perfectly timed for your exam date 🔥</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <p className="text-4xl text-cyan-300 font-bold animate-pulse">
              Creating your perfect monthly plan...
            </p>
            <p className="text-xl text-gray-300 mt-6">This takes 10-15 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
}