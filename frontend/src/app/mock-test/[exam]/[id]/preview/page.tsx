"use client";

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
    loadMock();
  }, [id]);

  async function loadMock() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/mockexam/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load mock");

      const data = await res.json();
      if (data.success && data.mock) {
        setMock(data.mock);
      } else {
        toast.error("Mock not found");
      }
    } catch (err) {
      toast.error("Failed to load mock test");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const startTest = () => {
    if (!mock || !mock.questions || mock.questions.length === 0) {
      toast.error("No questions in this mock!");
      return;
    }

    // Save mock data to localStorage for the test page
    localStorage.setItem("currentMock", JSON.stringify(mock));
    localStorage.setItem("mockStartTime", Date.now().toString());
    localStorage.setItem("mockExam", exam);
    localStorage.setItem("mockId", id);

    router.push(`/mock-test/${exam}/${id}/test`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <p className="text-3xl text-cyan-400 animate-pulse">Loading Mock Test...</p>
      </div>
    );
  }

  if (!mock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <p className="text-3xl text-red-400">Mock Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 p-12 shadow-2xl">
          <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-8">
            {mock.title || "JEE Mock Test"}
          </h1>

          <div className="text-center space-y-6 text-xl text-gray-200 mb-12">
            <p>⏱ <strong>{mock.duration} minutes</strong></p>
            <p>❓ <strong>{mock.questions?.length || 90} questions</strong></p>
            <p>📊 Full Syllabus</p>
            <p className="text-yellow-300 font-bold"></p>
          </div>

          <div className="text-center space-y-6">
            <Button
              onClick={startTest}
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-3xl font-bold px-20 py-10 rounded-2xl shadow-2xl transform hover:scale-110 transition-all"
            >
              START MOCK TEST NOW
            </Button>

            <p className="text-gray-400 mt-8">
              Once started, timer will begin. No pausing allowed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}