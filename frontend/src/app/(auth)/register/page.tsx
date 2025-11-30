'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    targetExam: '',
    targetYear: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          password: form.password,
          targetExam: form.targetExam,
          targetYear: form.targetYear
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Account created successfully! 🎉');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="backdrop-blur-3xl bg-white/8 border border-white/10 rounded-3xl shadow-2xl p-10 sm:p-12 md:p-16">

            <div className="text-center mb-12">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-cyan-300 drop-shadow-2xl">
                ExamEdge
              </h1>
              <p className="text-cyan-100 text-lg sm:text-xl md:text-2xl mt-4 font-medium tracking-wide">
                Built to Create Rank 1
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">

              <input
                required
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />

              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />

              <div className="relative">
                <select
                  required
                  value={form.targetExam}
                  onChange={(e) => setForm({ ...form, targetExam: e.target.value })}
                  className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl appearance-none cursor-pointer pr-12"
                >
                  <option value="" disabled>Select Your Target Exam</option>
                  <option value="JEE" className="bg-gray-900 text-white">JEE Main + Advanced</option>
                  <option value="NEET" className="bg-gray-900 text-white">NEET</option>
                  <option value="VITEEE" className="bg-gray-900 text-white">VITEEE</option>
                  <option value="BITSAT" className="bg-gray-900 text-white">BITSAT</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  required
                  value={form.targetYear}
                  onChange={(e) => setForm({ ...form, targetYear: e.target.value })}
                  className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl appearance-none cursor-pointer pr-12"
                >
                  <option value="" disabled>Select Target Year</option>
                  <option value="2025" className="bg-gray-900 text-white">2025</option>
                  <option value="2026" className="bg-gray-900 text-white">2026</option>
                  <option value="2027" className="bg-gray-900 text-white">2027</option>
                  <option value="2028" className="bg-gray-900 text-white">2028</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <input
                required
                type="password"
                placeholder="Create Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 transition-all backdrop-blur-xl"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-7 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-12 text-cyan-100 text-lg sm:text-xl">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-white underline decoration-2 underline-offset-4 hover:text-cyan-300 transition">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}