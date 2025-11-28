'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } else {
      alert('Wrong credentials');
    }
  };

  return (
    <div className="bg-slate-900 p-10 rounded-3xl border border-neon-green/30 shadow-2xl w-full max-w-md">
      <h1 className="text-5xl font-black text-neon-green text-center mb-8">ExamEdge</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input required type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-slate-800 border border-neon-green/50" onChange={e => setForm({...form, email: e.target.value})} />
        <input required type="password" placeholder="Password" className="w-full p-4 rounded-xl bg-slate-800 border border-neon-green/50" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit" className="w-full py-4 bg-neon-green text-black font-bold text-xl rounded-xl hover:scale-105 transition">
          Login
        </button>
      </form>
      <p className="text-center mt-8 text-gray-400">
        New here? <Link href="/register" className="text-neon-green font-bold">Register</Link>
      </p>
    </div>
  );
}