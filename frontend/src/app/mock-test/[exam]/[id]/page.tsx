"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MockTestPage() {
  const router = useRouter();
  const [mock, setMock] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentMock");
    const startTime = localStorage.getItem("mockStartTime");

    if (!saved || !startTime) {
      toast.error("No active test!");
      router.push("/mock-test");
      return;
    }

    const mockData = JSON.parse(saved);
    setMock(mockData);

    const totalSeconds = (mockData.duration || 180) * 60;
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    const remaining = Math.max(0, totalSeconds - elapsed);
    setTimeLeft(remaining);

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleFinalSubmit = () => {
    if (isFinished) return;
    setIsFinished(true);

    let correct = 0;
    mock.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const totalQ = mock.questions.length;
    const wrong = Object.keys(answers).length - correct;
    const marks = correct * 4 - wrong * 1;

    const result = {
      mockId: mock.id || "unknown",
      mockTitle: mock.title || "JEE Mock Test",
      marks,
      correct,
      wrong,
      unattempted: totalQ - Object.keys(answers).length,
      percentage: ((correct / totalQ) * 100).toFixed(2),
      timeTaken: (mock.duration * 60) - timeLeft,
      total: totalQ,
    };

    localStorage.setItem("lastMockResult", JSON.stringify(result));
    localStorage.removeItem("currentMock");
    localStorage.removeItem("mockStartTime");

    toast.success("Test Submitted! Calculating results...", { duration: 2000 });

    setTimeout(() => {
      router.push("/mock-test/result");
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mock) return null;

  const q = mock.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-purple-950 text-white">
      {/* Header */}
      <div className="bg-black/70 backdrop-blur border-b border-white/10 p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">{mock.title}</h1>
            <p className="text-gray-300">
              Q{currentQuestion + 1} / {mock.questions.length}
            </p>
          </div>
          <div className="text-5xl font-mono font-bold text-red-500 animate-pulse">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-10 mt-10 shadow-2xl">
          <div className="text-2xl md:text-3xl font-medium mb-10 leading-relaxed">
            Q{currentQuestion + 1}. {q.question}
          </div>

          <div className="space-y-6">
            {q.options.map((opt: string, i: number) => (
              <Button
                key={i}
                variant={answers[currentQuestion] === i ? "default" : "outline"}
                className={`w-full text-left text-lg py-8 px-8 justify-start h-auto transition-all ${
                  answers[currentQuestion] === i
                    ? "bg-cyan-600 hover:bg-cyan-500 border-cyan-400"
                    : "border-white/30 hover:bg-white/10"
                }`}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: i })}
              >
                <span className="font-bold text-xl mr-4">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </Button>
            ))}
          </div>

          {/* BOTTOM BAR WITH SUBMIT BUTTON */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="lg"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(c => c - 1)}
              >
                ← Previous
              </Button>

              {/* FINAL SUBMIT BUTTON — ALWAYS VISIBLE ON LAST QUESTION */}
              {currentQuestion === mock.questions.length - 1 && (
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isFinished}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-xl font-bold px-16 py-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all"
                >
                  {isFinished ? "Submitting..." : "FINAL SUBMIT TEST"}
                </Button>
              )}

              {currentQuestion < mock.questions.length - 1 && (
                <Button
                  size="lg"
                  onClick={() => setCurrentQuestion(c => c + 1)}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-600"
                >
                  Next →
                </Button>
              )}
            </div>
          </div>

          {/* Question Palette */}
          <div className="flex justify-center gap-3 mt-10 flex-wrap">
            {mock.questions.map((_: any, i: number) => (
              <div
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${
                  i === currentQuestion
                    ? "bg-yellow-500 text-black scale-125"
                    : answers[i] !== undefined
                    ? "bg-cyan-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}