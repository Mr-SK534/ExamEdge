'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  useEffect(() => {
    if (!localStorage.getItem('token')) window.location.href = '/register';
  }, []);

  return (
    <div className="min-h-screen bg-dark-blue">
      <nav className="bg-slate-900/80 backdrop-blur border-b border-neon-green/30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-black text-neon-green">ExamEdge</h1>
          <button onClick={() => { localStorage.clear(); window.location.href='/login' }} className="text-gray-400 hover:text-neon-green">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Weapon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/mock-creator" className="bg-slate-900 p-10 rounded-2xl border border-neon-green/40 text-center hover:scale-105 transition hover:border-neon-green">
            <h3 className="text-2xl font-bold text-neon-green mb-4">Create My Own Mock</h3>
            <p>Custom PYQs • Difficulty • Weak Topics</p>
          </Link>
          <Link href="/doubt-solver" className="bg-slate-900 p-10 rounded-2xl border border-neon-green/40 text-center hover:scale-105 transition hover:border-neon-green">
            <h3 className="text-2xl font-bold text-neon-green mb-4">AI Doubt Solver</h3>
            <p>Ask anything 24×7</p>
          </Link>
          {/* More cards coming tomorrow */}
        </div>
      </div>
    </div>
  );
}