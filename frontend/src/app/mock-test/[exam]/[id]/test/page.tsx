"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
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
      toast.error("No active test found!");
      router.push("/mock-test");
      return;
    }

    const mockData = JSON.parse(saved);
    setMock(mockData);

    const totalSeconds = (mockData.duration || 180) * 60;
    const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
    const remaining = Math.max(0, totalSeconds - elapsed);
    setTimeLeft(remaining);

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

    toast.success("Test Submitted!", { duration: 2000 });
    setTimeout(() => router.push("/mock-test/result"), 2000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (!mock) return null;

  const q = mock.questions[currentQuestion];
  const isLastQuestion = currentQuestion === mock.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {mock.title}
            </h1>
            <p className="text-gray-300 mt-1">
              Question <span className="text-cyan-400 font-bold">{currentQuestion + 1}</span> / {mock.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Time Left</p>
            <p className="text-5xl font-mono font-bold text-red-500 animate-pulse">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-8 pb-32">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl h-full">
          <div className="p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-12 leading-relaxed">
              Q{currentQuestion + 1}. {q.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {q.options.map((opt: string, i: number) => (
                <Button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQuestion]: i })}
                  variant={answers[currentQuestion] === i ? "default" : "outline"}
                  className={`h-32 text-left text-xl font-medium transition-all ${
                    answers[currentQuestion] === i
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 border-2 border-cyan-300 shadow-2xl"
                      : "border-2 border-white/30 hover:border-cyan-400 hover:bg-white/10"
                  }`}
                >
                  <span className="font-bold text-2xl mr-6">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* FINAL FIX: All buttons in ONE clean centered box at bottom */}
      <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <div className="bg-black/95 backdrop-blur-2xl rounded-3xl px-10 py-8 border border-cyan-500/60 shadow-2xl">
            <div className="flex items-center gap-8">

              {/* Previous Button - Always visible except Q1 */}
              {currentQuestion > 0 && (
                <Button
                  onClick={() => setCurrentQuestion(c => c - 1)}
                  size="lg"
                  variant="outline"
                  className="px-14 py-8 text-xl font-bold border-2 border-white/40 hover:border-cyan-400 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-8 h-8 mr-3" />
                  Previous
                </Button>
              )}

              {/* Next Button - Hidden on last question */}
              {!isLastQuestion && (
                <Button
                  onClick={() => setCurrentQuestion(c => c + 1)}
                  size="lg"
                  className="px-20 py-8 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-2xl transform hover:scale-105 transition-all"
                >
                  Next
                  <ChevronRight className="w-8 h-8 ml-4" />
                </Button>
              )}

              {/* Submit Button - Only on last question */}
              {isLastQuestion && (
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isFinished}
                  size="lg"
                  className="px-24 py-10 text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-2xl transform hover:scale-110 transition-all"
                >
                  <Send className="w-9 h-9 mr-4" />
                  {isFinished ? "Submitting..." : "SUBMIT TEST"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}