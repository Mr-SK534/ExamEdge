'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AIDoubtSolverPage() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [reasoning, setReasoning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAnswer(null);

    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context, reasoning }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data?.error || 'Server error');
      } else {
        setAnswer(data.answer ?? JSON.stringify(data.raw, null, 2));
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------
  // PAGE UI
  // -------------------------------
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-12 text-white">

      {/* PAGE TITLE */}
      <h1 className="text-5xl font-bold mb-10 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
        AI Doubt Solver
      </h1>

      {/* FORM CARD */}
      <Card className="w-full max-w-3xl bg-white/10 border-white/20 p-8 backdrop-blur-xl rounded-3xl mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* QUESTION */}
          <div>
            <label className="block text-lg text-gray-300 mb-2">Your Question</label>
            <textarea
              className="w-full rounded-xl p-4 bg-white/5 text-white text-[16px] border border-white/20"
              rows={6}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your problem here... (Explain steps, topic, what confused you)"
            />
          </div>

          {/* CONTEXT */}
          <div>
            <label className="block text-lg text-gray-300 mb-2">Extra Context (optional)</label>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Example: NEET Physics, Optics | JEE Maths, Calculus | Class 12"
              className="w-full rounded-xl p-4 bg-white/5 text-white text-[16px] border border-white/20"
            />
          </div>

          {/* OPTIONS + SUBMIT */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-gray-200 text-[16px]">
              <input
                type="checkbox"
                checked={reasoning}
                onChange={(e) => setReasoning(e.target.checked)}
              />
              Show step-by-step reasoning
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="ml-auto bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-[16px] rounded-xl"
            >
              {loading ? 'Solving…' : 'Solve'}
            </Button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-400 text-[16px] mt-2">{error}</p>
          )}
        </form>
      </Card>

      {/* ANSWER SECTION */}
<div className="w-full max-w-4xl">
  <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Answer</h2>

  <Card className="p-8 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl">

    <div className="max-h-[350px] overflow-y-auto pr-2 custom-scroll">
      {loading && (
        <p className="text-gray-300 text-[16px]">Thinking…</p>
      )}

      {!loading && !answer && (
        <p className="text-gray-400 text-[16px]">
          Your answer will appear here after solving.
        </p>
      )}

      {!loading && answer && (
        <pre className="whitespace-pre-wrap text-white text-[16px] leading-relaxed">
          {answer}
        </pre>
      )}
    </div>

    </Card>
    </div>
    </div>
  );
}
