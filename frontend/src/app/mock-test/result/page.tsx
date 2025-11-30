"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MockTestResultPage() {
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://examedge-7o44.onrender.com";

  useEffect(() => {
    const saved = localStorage.getItem("lastMockResult");
    if (saved) {
      const data = JSON.parse(saved);
      setResult(data);
      saveToBackend(data); // Auto-save to backend
    } else {
      toast.error("No result found! Complete a mock first.");
    }
  }, []);

  async function saveToBackend(resultData: any) {
    if (saving || !localStorage.getItem("accessToken")) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/mock-history/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          mockId: resultData.mockId || "unknown",
          mockTitle: resultData.mockTitle || "JEE Mock Test",
          score: resultData.marks,
          correct: resultData.correct,
          wrong: resultData.wrong,
          unattempted: resultData.unattempted,
          percentage: resultData.percentage,
          timeTaken: resultData.timeTaken,
          totalQuestions: resultData.total,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("Result saved to your profile! Check History 🔥");
      } else {
        toast("Saved locally (will sync when online)");
      }
    } catch (err) {
      console.log("Offline mode: result saved locally");
      toast("Saved locally (will sync later)");
    } finally {
      setSaving(false);
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <p className="text-3xl text-gray-400">No result found. Complete a mock first!</p>
      </div>
    );
  }

  const rankMessage =
    result.percentage >= 99.5
      ? "AIR 1-10 🔥"
      : result.percentage >= 98
      ? "AIR <100 🏆"
      : result.percentage >= 95
      ? "AIR <1000 💎"
      : result.percentage >= 90
      ? "Top 1% 🔥"
      : "Keep Grinding! You're getting there 💪";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        {/* Epic Header */}
        <div className="text-center mb-12">
          <Trophy className="w-28 h-28 mx-auto text-yellow-400 mb-6 animate-bounce" />
          <h1 className="text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 leading-tight">
            MOCK COMPLETED!
          </h1>
          <p className="text-3xl mt-4 text-gray-200 font-medium">{result.mockTitle}</p>
          <p className="text-xl text-gray-400 mt-2">{new Date().toLocaleDateString("en-IN")}</p>
        </div>

        {/* Score + Percentile */}
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 p-10 mb-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <p className="text-gray-400 text-lg">Your Score</p>
              <p className="text-8xl font-extrabold text-cyan-400 mt-3">
                {result.marks}
              </p>
              <p className="text-3xl text-gray-300">/ {result.total * 4}</p>
            </div>

            <div>
              <p className="text-gray-400 text-lg">Estimated Rank</p>
              <p className="text-5xl font-extrabold text-yellow-400 mt-3">
                {rankMessage}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-lg">Percentage</p>
              <p className="text-8xl font-extrabold text-emerald-400 mt-3">
                {result.percentage}%
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-green-600/20 border-green-500/50 p-8 text-center transform hover:scale-105 transition">
            <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
            <p className="text-5xl font-bold">{result.correct}</p>
            <p className="text-gray-300 text-lg">Correct</p>
          </Card>

          <Card className="bg-red-600/20 border-red-500/50 p-8 text-center transform hover:scale-105 transition">
            <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-5xl font-bold">{result.wrong}</p>
            <p className="text-gray-300 text-lg">Wrong</p>
          </Card>

          <Card className="bg-yellow-600/20 border-yellow-500/50 p-8 text-center transform hover:scale-105 transition">
            <AlertCircle className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <p className="text-5xl font-bold">{result.unattempted}</p>
            <p className="text-gray-300 text-lg">Unattempted</p>
          </Card>

          <Card className="bg-cyan-600/20 border-cyan-500/50 p-8 text-center transform hover:scale-105 transition">
            <Clock className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
            <p className="text-5xl font-bold">{Math.floor(result.timeTaken / 60)}m</p>
            <p className="text-gray-300 text-lg">Time Taken</p>
          </Card>
        </div>

        {/* Buttons */}
        <div className="text-center space-x-6">
          <Link href="/mock-test">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-2xl px-16 py-8 font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition">
              Attempt Another Mock
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="text-xl px-12 py-8 border-2 border-cyan-500 text-cyan-300 hover:bg-cyan-500/20">
              View Full History
            </Button>
          </Link>
        </div>

        {/* Final Motivation */}
        <div className="text-center mt-20">
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-red-500">
            JEE 2026 IS YOURS.
          </p>
          <p className="text-2xl text-gray-400 mt-4">— Made by ExamEdge • For the Future IITians of India</p>
        </div>
      </div>
    </div>
  );
}