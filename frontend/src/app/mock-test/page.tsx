"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MockTestListPage() {
  const router = useRouter();
  const [mocks, setMocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user's target exam from localStorage (fallback to "jee")
  const profile =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("profile") || "{}")
      : {};

  const targetExam = (profile.target_exam || "jee").toLowerCase();

  // API URL — works on localhost AND production (Render + Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://examedge-7o44.onrender.com";

  useEffect(() => {
    loadMocks();
  }, []);

  async function loadMocks() {
    try {
      const res = await fetch(`${API_URL}/api/mockexam/available`, {
        cache: "no-store", // Always get fresh data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      
      if (data.success && data.mocks?.length > 0) {
        setMocks(data.mocks);
      } else {
        toast.info("No mock tests found for your exam. More coming soon! 🔥");
      }
    } catch (err) {
      console.error("Load mocks error:", err);
      toast.error("Failed to load mocks. Check internet or try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <p className="text-2xl text-cyan-400 animate-pulse">Loading mock tests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
          Available Mock Tests
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          {targetExam.toUpperCase()} • Full Syllabus • Real Exam Pattern
        </p>

        {mocks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-400 mb-6">
              No mock tests available for your target exam.
            </p>
            <p className="text-xl text-cyan-300">
              We're adding {targetExam.toUpperCase()} mocks daily! Check back soon 🔥
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mocks.map((mock) => (
              <Card
                key={mock.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                  {mock.title}
                </h2>

                <div className="space-y-3 text-gray-200 mb-8">
                  <p>⏱ Duration: {mock.duration} minutes</p>
                  <p>❓ Questions: {mock.totalQuestions}</p>
                  <p>📚 Subjects: {mock.subjects?.join(" • ") || "Physics • Chemistry • Maths"}</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => router.push(`/mock-test/${targetExam}/${mock.id}/preview`)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-lg font-bold py-6"
                  >
                    Start Test
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/mock-test/${targetExam}/${mock.id}/preview`)}
                    className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20"
                  >
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}