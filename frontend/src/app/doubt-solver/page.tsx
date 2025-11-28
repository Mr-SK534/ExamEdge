'use client';
import { useState } from 'react';

export default function DoubtSolver() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const ask = async () => {
    const res = await fetch('http://localhost:5000/api/doubt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="min-h-screen bg-dark-blue p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neon-green text-center mb-10">
          AI Doubt Solver
        </h1>

        <textarea
          placeholder="Ask anything..."
          className="w-full p-6 rounded-2xl bg-slate-800 border border-neon-green/50 h-40"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />

        <button
          onClick={ask}
          className="mt-6 w-full py-5 bg-neon-green text-black font-bold text-xl rounded-xl hover:scale-105 transition"
        >
          Solve My Doubt
        </button>

        {answer && (
          <div
            className="mt-10 p-8 bg-slate-800 rounded-2xl border border-neon-green/30"
            dangerouslySetInnerHTML={{
              __html: answer.replace(/\n/g, '<br/>')
            }}
          />
        )}
      </div>
    </div>
  );
}
