"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function MockTestPage() {
  const router = useRouter();
  const params = useParams();
  const exam = params.exam as string;
  const id = params.id as string;

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

    let mockData;
    try {
      mockData = JSON.parse(saved);
    } catch (err) {
      toast.error("Test data corrupted!");
      router.push("/mock-test");
      return;
    }

    // SAFETY CHECKS — YE 4 LINES NE TERA APP KO UNBREAKABLE BANAYA
    if (!mockData || !mockData.questions || !Array.isArray(mockData.questions) || mockData.questions.length === 0) {
      toast.error("Invalid or empty mock test!");
      router.push("/mock-test");
      return;
    }

    setMock(mockData);

    const totalSeconds = (mockData.duration_minutes || mockData.duration || 180) * 60;
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
    if (isFinished || !mock) return;
    setIsFinished(true);

    let correct = 0;

    mock.questions.forEach((q: any, i: number) => {
      if (q.correctAnswer != null && answers[i] === q.correctAnswer) {
        correct++;
      }
    });

    const totalQ = mock.questions.length;
    const attempted = Object.keys(answers).length;
    const wrong = attempted - correct;
    const marks = correct * 4 - wrong * 1;

    const result = {
      mockId: mock.id || id,
      mockTitle: mock.paper_name || mock.title || "JEE Mock Test",
      marks,
      correct,
      wrong,
      unattempted: totalQ - attempted,
      percentage: totalQ > 0 ? ((correct / totalQ) * 100).toFixed(2) : "0.00",
      timeTaken: (mock.duration_minutes || mock.duration || 180) * 60 - timeLeft,
      total: totalQ,
    };

    localStorage.setItem("lastMockResult", JSON.stringify(result));
    localStorage.removeItem("currentMock");
    localStorage.removeItem("mockStartTime");

    toast.success("Test Submitted Successfully! 🔥", { duration: 2500 });
    setTimeout(() => router.push("/mock-test/result"), 2500);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // FINAL SAFETY — agar mock load nahi hua
  if (!mock || !mock.questions || mock.questions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl text-red-500 font-bold mb-8">Test Loading Failed</p>
          <Button onClick={() => router.push("/mock-test")} className="text-xl px-10 py-6">
            Back to Mocks
          </Button>
        </div>
      </div>
    );
  }

  const q = mock.questions[currentQuestion];
  const isLastQuestion = currentQuestion === mock.questions.length - 1;

  // Agar question mein options nahi hai (integer type)
  if (!q.options || !Array.isArray(q.options)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Numerical question support coming soon...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              {mock.paper_name || mock.title || "JEE Mock Test"}
            </h1>
            <p className="text-gray-300 mt-1">
              Question <span className="text-cyan-400 font-bold">{currentQuestion + 1}</span> / {mock.questions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Time Remaining</p>
            <p className="text-5xl font-mono font-bold text-red-500 animate-pulse drop-shadow-lg">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl">
          <div className="p-10 md:p-16">

            {/* Question */}
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-16 leading-relaxed">
              Q{currentQuestion + 1}. {q.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
              {q.options.map((opt: string, i: number) => (
                <Button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQuestion]: i })}
                  variant={answers[currentQuestion] === i ? "default" : "outline"}
                  className={`h-32 text-left text-xl font-medium transition-all transform hover:scale-105 ${
                    answers[currentQuestion] === i
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white border-4 border-cyan-300 shadow-2xl shadow-cyan-500/50"
                      : "border-2 border-white/30 hover:border-cyan-400 hover:bg-white/10"
                  }`}
                >
                  <span className="font-bold text-3xl mr-6">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-lg leading-relaxed">{opt}</span>
                </Button>
              ))}
            </div>

            {/* VERTICAL BUTTONS ON RIGHT */}
            <div className="flex justify-end">
              <div className="space-y-6 w-96">

                {currentQuestion > 0 && (
                  <Button
                    onClick={() => setCurrentQuestion(c => c - 1)}
                    size="lg"
                    variant="outline"
                    className="w-full py-8 text-xl font-bold border-2"
                  >
                    <ChevronLeft className="w-8 h-8 mr-4" />
                    Previous Question
                  </Button>
                )}

                {!isLastQuestion && (
                  <Button
                    onClick={() => setCurrentQuestion(c => c + 1)}
                    size="lg"
                    className="w-full py-8 text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-2xl"
                  >
                    Next Question
                    <ChevronRight className="w-8 h-8 ml-4" />
                  </Button>
                )}

                {isLastQuestion && (
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isFinished}
                    size="lg"
                    className="w-full py-12 text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-2xl transform hover:scale-110 transition-all"
                  >
                    <Send className="w-10 h-10 mr-5" />
                    {isFinished ? "Submitting..." : "FINAL SUBMIT TEST"}
                  </Button>
                )}
              </div>
            </div>

            {/* Question Palette */}
            <div className="mt-24 pt-12 border-t border-white/20">
              <p className="text-center text-gray-400 mb-8 text-xl font-bold">Question Palette</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {mock.questions.map((_: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all shadow-xl ${
                      i === currentQuestion
                        ? "bg-yellow-500 text-black scale-125 ring-4 ring-yellow-400"
                        : answers[i] !== undefined
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}