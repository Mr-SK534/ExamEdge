'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DailyPlanPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

  async function generatePlan() {
    if (!token || !user) {
      toast.error("Please login first!");
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exam: user.exam || "JEE",
          examDate: `${user.target_year || "2025"}-04-02`
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.plan) {
        const planText = typeof data.plan === "string" ? data.plan : JSON.stringify(data.plan, null, 2);
        setPlan(planText);
        toast.success("Daily plan generated! Let's crush today 🔥");
      } else {
        toast.error(data.message || data.error || "Failed to generate plan");
      }
    } catch (err) {
      console.error("Daily plan error:", err);
      toast.error("Server busy. Try again in 10 seconds.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20">

        <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-12 drop-shadow-2xl">
          Daily Study Target Pro
        </h1>

        <div className="text-center mb-16">
          <Button
            onClick={generatePlan}
            disabled={loading || !user}
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-2xl px-20 py-10 font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition-all disabled:opacity-60"
          >
            {loading ? "Generating Your Perfect Daily Plan..." : "Generate Today's Plan"}
          </Button>
        </div>

        <div className="bg-white/10 rounded-2xl p-10 border border-white/20 min-h-[400px]">
          {!user ? (
            <p className="text-center text-red-400 text-2xl font-bold">Please login to generate your daily plan</p>
          ) : !plan && !loading ? (
            <div className="text-center py-20">
              <p className="text-3xl text-gray-400 mb-4">Your AI-powered daily plan will appear here</p>
              <p className="text-xl text-cyan-300">Perfectly balanced • High-yield topics • Revision included</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20">
              <p className="text-4xl text-cyan-300 font-bold animate-pulse">
                Grok is creating your perfect daily schedule...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <pre className="whitespace-pre-wrap text-gray-100 text-lg leading-relaxed font-mono bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl">
                {plan}
              </pre>

              <div className="text-center">
                <Button
                  onClick={() => {
                    if (!plan) return;
                    const blob = new Blob([plan], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ExamEdge_Daily_Plan_${new Date().toISOString().slice(0,10)}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xl px-12 py-6 font-bold rounded-2xl shadow-xl"
                >
                  Download Today's Plan
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-12 text-gray-400">
          <p className="text-lg">Made with 🔥 by ExamEdge • India's #1 JEE & NEET Platform</p>
        </div>
      </div>
    </div>
  );
}