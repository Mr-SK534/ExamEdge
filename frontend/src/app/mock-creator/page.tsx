'use client';
import { useState } from 'react';

export default function MockCreator() {
  const [form, setForm] = useState({
    exam: 'JEE Main & Advanced',
    subjects: [] as string[],
    totalQuestions: 90,
    easy: 30, medium: 40, tough: 30,
    includeWeak: true,
    includeRepeated: true,
    timeLimit: 180
  });

  return (
    <div className="min-h-screen bg-dark-blue p-8">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-10 border border-neon-green/30">
        <h1 className="text-4xl font-bold text-neon-green text-center mb-10">Create My Own Mock Test</h1>
        <div className="grid gap-8">
          <select className="p-4 rounded-xl bg-slate-800 border border-neon-green/50" onChange={e => setForm({...form, exam: e.target.value})}>
            <option>JEE Main & Advanced</option>
            <option>NEET</option>
            <option>CUET</option>
            <option>WBJEE</option>
            <option>UPSC CSE</option>
            <option>NDA</option>
          </select>

          <div className="text-2xl text-center text-neon-green font-bold">
            Coming in Final Build — This will generate real PYQ mock!
          </div>

          <button className="py-5 bg-neon-green text-black text-2xl font-black rounded-xl hover:scale-105 transition">
            Generate Mock Now
          </button>
        </div>
      </div>
    </div>
  );
}