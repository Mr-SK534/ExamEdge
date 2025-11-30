'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (token && user) {
      fetchTodayPlan();
    }
  }, [token, user]);

  async function fetchTodayPlan() {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/today`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setPlan(data.plan?.plan_json || data.plan || null);
      setStreak(data.streak || 0);
    } catch (err) {
      console.log("No plan yet or error:", err);
    }
  }

  async function generatePlan() {
    if (!token || !user) {
      alert("Please login first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          exam: user.exam || "JEE",
          examDate: `${user.target_year || "2025"}-04-02`   // ← THIS WAS MISSING PROPERLY
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPlan(data.plan);
        setStreak(data.streak || 0);
        alert("Daily plan generated successfully! 🔥");
      } else {
        alert(data.message || "Failed to generate plan");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function markDone(i: number) {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/daily-plan/done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ taskIndex: i })
      });

      const data = await res.json();
      if (data.success) {
        setPlan(data.plan);
        setStreak(data.streak);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-10">
          Daily Study Target 🔥
        </h1>

        <div className="text-center mb-10">
          <Button
            size="lg"
            onClick={generatePlan}
            disabled={loading || !user}
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-xl px-12 py-8 font-bold shadow-2xl"
          >
            {loading ? "Generating Your Perfect Plan..." : "Generate Today's Plan"}
          </Button>
        </div>

        <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 shadow-2xl">
          {!user ? (
            <p className="text-center text-red-400 text-2xl">Please login to use Daily Target</p>
          ) : !plan ? (
            <div className="text-center py-20">
              <p className="text-3xl text-gray-400 mb-4">No plan for today yet</p>
              <p className="text-xl text-cyan-300">Click the button above to generate your AI-powered daily plan!</p>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-center text-cyan-300 mb-8">Today's Master Plan</h2>
              
              <div className="space-y-6">
                {plan.today?.map((task: any, i: number) => (
                  <div
                    key={i}
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-2xl border-2 transition-all ${
                      task.done 
                        ? "bg-emerald-900/50 border-emerald-500 shadow-xl shadow-emerald-500/30" 
                        : "bg-white/5 border-white/10 hover:border-cyan-500"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-3xl font-bold text-white">{task.subject}</p>
                      <p className="text-xl text-gray-200 mt-2">{task.topic}</p>
                      <p className="text-lg text-gray-400 mt-3">⏱ {task.time || "As per pace"}</p>
                    </div>
                    
                    <Button
                      size="lg"
                      onClick={() => markDone(i)}
                      disabled={task.done}
                      className={
                        task.done 
                          ? "bg-emerald-600 hover:bg-emerald-500 text-xl px-10" 
                          : "bg-cyan-600 hover:bg-cyan-500 text-xl px-10"
                      }
                    >
                      {task.done ? "Completed ✓" : "Mark as Done"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-6xl font-black text-emerald-400">
                  Streak: {streak} Day{streak !== 1 ? "s" : ""} 🔥
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}