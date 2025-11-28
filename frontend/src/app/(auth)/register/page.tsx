'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', targetExam: 'JEE Main & Advanced'
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Welcome to ExamEdge!');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-2xl border border-neon-green/30 p-8 sm:p-10 md:p-12">
      <h1 className="text-4xl sm:text-5xl font-black text-neon-green text-center mb-center mb-10 tracking-tight">
        ExamEdge
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          required
          type="text"
          placeholder="Full Name"
          className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-neon-green/50 focus:border-neon-green focus:outline-none text-lg transition"
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-neon-green/50 focus:border-neon-green focus:outline-none text-lg"
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-neon-green/50 focus:border-neon-green focus:outline-none text-lg"
          onChange={e => setForm({...form, password: e.target.value})}
        />

        <select 
          className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-neon-green/50 text-lg"
          onChange={e => setForm({...form, targetExam: e.target.value})}
        >
          <option>JEE Main & Advanced</option>
          <option>NEET</option>
          <option>CUET</option>
          <option>WBJEE</option>
          <option>UPSC CSE</option>
          <option>NDA</option>
          <option>Class 12 Boards</option>
        </select>

        <button
          type="submit"
          className="w-full py-5 bg-neon-green text-black font-bold text-xl rounded-xl hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-neon-green/20"
        >
          Create Account
        </button>
      </form>

      <p className="text-center mt-center mt-8 text-gray-400 text-sm sm:text-base">
        Already have an account?{' '}
        <Link href="/login" className="text-neon-green font-bold hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}