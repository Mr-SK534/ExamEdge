"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function MockPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const exam = params.exam as string;
  const id = params.id as string;

  const [mock, setMock] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://examedge-7o44.onrender.com";

  useEffect(() => {
    if (!id) return;
    loadMock();
  }, [id]);

  async function loadMock() {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${API_URL}/api/mockexam/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to load mock");
      }

      const data = await res.json();

      if (data.success && data.mock) {
        setMock(data.mock);
      } else {
        toast.error("Mock not found or invalid data");
        router.push("/mock-test");
      }
    } catch (err: any) {
      console.error("Load mock error:", err);
      toast.error(err.message || "Failed to load mock test");
      router.push("/mock-test");
    } finally {
      setLoading(false);
    }
  }

  const startTest = () => {
    if (!mock) {
      toast.error("Mock data not loaded!");
      return;
    }

    if (!mock.questions || !Array.isArray(mock.questions) || mock.questions.length === 0) {
      toast.error("This mock has no questions!");
      return;
    }

    // Save to localStorage
    localStorage.setItem("currentMock", JSON.stringify(mock));
    localStorage.setItem("mockStartTime", Date.now().toString());
    localStorage.setItem("mockExam", exam);
    localStorage.setItem("mockId", id);

    toast.success("Mock test started! Good luck warrior 🔥", { duration: 2000 });
    
    router.push(`/mock-test/${exam}/${id}/test`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-3xl text-cyan-400 font-bold animate-pulse">Loading Your Mock Test...</p>
        </div>
      </div>
    );
  }

  // Mock Not Found
  if (!mock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-black flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-16 text-center">
          <p className="text-4xl text-red-400 font-bold mb-8">Mock Test Not Found</p>
          <Button onClick={() => router.push("/mock-test")} size="lg" className="text-xl px-12 py-8">
            Back to Mock Tests
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-2xl border-white/20 p-16 shadow-3xl rounded-3xl">
            <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 mb-10 drop-shadow-2xl">
              {mock.paper_name || mock.title || "JEE Mock Test"}
            </h1>

            <div className="text-center space-y-8 text-2xl text-gray-200 mb-16">
              <p>⏱ <strong className="text-4xl text-yellow-400">{mock.duration_minutes || mock.duration || 180} minutes</strong></p>
              <p>❓ <strong className="text-4xl text-cyan-400">{mock.questions?.length || 90} questions</strong></p>
              <p>📊 Full Syllabus • JEE Main 2025 Pattern</p>
              <p className="text-3xl text-yellow-300 font-bold mt-8">
                +{mock.questions?.length * 4 || 360} XP on Completion
              </p>
            </div>

            {/* Instructions */}
            {mock.instructions && mock.instructions.length > 0 && (
              <div className="bg-black/30 backdrop-blur rounded-2xl p-8 mb-12 border border-white/10">
                <h3 className="text-2xl font-bold text-emerald-400 mb-6">Instructions</h3>
                <ul className="space-y-3 text-gray-200 text-lg">
                  {mock.instructions.map((inst: string, i: number) => (
                    <li key={i}>• {inst}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center space-y-10">
              <Button
                onClick={startTest}
                className="bg-gradient-to-r from-emerald-500 via-cyan-600 to-blue-700 hover:from-emerald-400 hover:via-cyan-500 hover:to-blue-600 text-4xl font-extrabold px-32 py-16 rounded-3xl shadow-3xl transform hover:scale-110 transition-all duration-300"
              >
                START MOCK TEST NOW
              </Button>

              <p className="text-xl text-gray-400">
                Once started, timer will begin • No pausing allowed • Give it like real JEE
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}