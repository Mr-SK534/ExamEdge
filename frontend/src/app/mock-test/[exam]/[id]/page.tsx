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

    toast.success("Test Submitted Successfully! 🔥", { duration: 3000 });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white">
      {/* Modern Header */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {mock.title}
            </h1>
            <p className="text-gray-300 mt-1">
              Question <span className="text-cyan-400 font-bold">{currentQuestion + 1}</span> of{" "}
              <span className="text-emerald-400 font-bold">{mock.questions.length}</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Time Remaining</p>
            <p className="text-5xl font-bold text-red-500 font-mono animate-pulse">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <Card className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-3xl rounded-3xl overflow-hidden">
          <div className="p-10 md:p-16">
            {/* Question */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-8 leading-relaxed">
                Q{currentQuestion + 1}. {q.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {q.options.map((opt: string, i: number) => (
                <Button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQuestion]: i })}
                  variant={answers[currentQuestion] === i ? "default" : "outline"}
                  className={`h-24 text-left text-lg font-medium transition-all transform hover:scale-105 ${
                    answers[currentQuestion] === i
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white border-2 border-cyan-300 shadow-2xl shadow-cyan-500/50"
                      : "bg-white/5 border-2 border-white/30 hover:bg-white/10 hover:border-cyan-400"
                  }`}
                >
                  <span className="text-2xl font-bold mr-4">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-lg">{opt}</span>
                </Button>
              ))}
            </div>

            {/* Navigation Bar - Fixed at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-cyan-500/50 p-6 z-40">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Previous Button */}
                <Button
                  onClick={() => setCurrentQuestion(c => Math.max(0, c - 1))}
                  disabled={currentQuestion === 0}
                  size="lg"
                  variant="outline"
                  className="px-10 py-7 text-xl font-bold border-2"
                >
                  <ChevronLeft className="w-6 h-6 mr-2" />
                  Previous
                </Button>

                {/* Question Palette */}
                <div className="hidden md:flex gap-2">
                  {mock.questions.map((_: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => setCurrentQuestion(i)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${
                        i === currentQuestion
                          ? "bg-yellow-500 text-black scale-125 shadow-xl"
                          : answers[i] !== undefined
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Next or Submit Button */}
                {isLastQuestion ? (
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isFinished}
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 px-16 py-8 text-2xl font-bold shadow-2xl transform hover:scale-110 transition-all"
                  >
                    <Send className="w-7 h-7 mr-3" />
                    {isFinished ? "Submitting..." : "SUBMIT TEST"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(c => c + 1)}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 px-12 py-7 text-xl font-bold shadow-xl"
                  >
                    Next
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}