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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentMock");
    const startTime = localStorage.getItem("mockStartTime");

    if (!saved || !startTime) {
      toast.error("No active test found!");
      router.push("/mock-test/jee");
      return;
    }

    const mockData = JSON.parse(saved);
    setMock(mockData);

    const durationMs = (mockData.duration || 180) * 60 * 1000;
    const elapsed = Date.now() - parseInt(startTime);
    const remaining = Math.max(0, durationMs - elapsed);

    setTimeLeft(Math.floor(remaining / 1000));

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let correct = 0;
    mock.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const score = {
      total: mock.questions.length,
      correct,
      wrong: Object.keys(answers).length - correct,
      unattempted: mock.questions.length - Object.keys(answers).length,
      percentage: ((correct / mock.questions.length) * 100).toFixed(2),
      marks: correct * 4 - (Object.keys(answers).length - correct) * 1, // JEE marking
      timeTaken: mock.duration * 60 - timeLeft,
    };

    // Save result
    localStorage.setItem("lastMockResult", JSON.stringify({
      ...score,
      mockTitle: mock.title,
      mockId: mock.id || "mock2",
      date: new Date().toISOString(),
    }));

    // Cleanup
    localStorage.removeItem("currentMock");
    localStorage.removeItem("mockStartTime");

    toast.success(`Test Submitted! You scored ${correct}/${mock.questions.length} 🎉`);

    // Redirect to result page (create this later or redirect to home)
    router.push(`/mock-test/result`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!mock) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-3xl text-cyan-400 animate-pulse">Loading your test...</p>
      </div>
    );
  }

  const question = mock.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur border-b border-white/10 p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">{mock.title}</h1>
            <p className="text-gray-300">Question {currentQuestion + 1} of {mock.questions.length}</p>
          </div>
          <div className="text-4xl font-mono font-bold text-red-500 animate-pulse">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-10 mt-8">
          <div className="text-2xl font-semibold mb-8 leading-relaxed">
            Q{currentQuestion + 1}. {question.question}
          </div>

          <div className="space-y-5">
            {question.options.map((opt: string, i: number) => (
              <Button
                key={i}
                variant={answers[currentQuestion] === i ? "default" : "outline"}
                className={`w-full text-left text-lg py-8 px-6 justify-start transition-all ${
                  answers[currentQuestion] === i
                    ? "bg-cyan-600 hover:bg-cyan-500 border-cyan-400"
                    : "border-white/30 hover:bg-white/10"
                }`}
                onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: i }))}
              >
                <span className="mr-4 font-bold">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </Button>
            ))}
          </div>

          {/* Navigation & Submit */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              size="lg"
            >
              ← Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                {Object.keys(answers).length} / {mock.questions.length} Answered
              </p>
              <div className="flex gap-2">
                {mock.questions.map((_: any, i: number) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      answers[i] !== undefined
                        ? "bg-cyan-500"
                        : i === currentQuestion
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentQuestion === mock.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-xl font-bold px-12 py-6"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(mock.questions.length - 1, prev + 1))}
                size="lg"
              >
                Next →
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}