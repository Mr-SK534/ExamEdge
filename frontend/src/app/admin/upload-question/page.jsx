"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function UploadQuestion() {
  const [form, setForm] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    subject: "",
    chapter: "",
    difficulty: "Easy",
    exam: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Question added!");
        setForm({
          question: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "A",
          subject: "",
          chapter: "",
          difficulty: "Easy",
          exam: "",
        });
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Server error");
    }
  };

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="p-10 text-white min-h-screen bg-gradient-to-br from-slate-900 to-black">
      <h1 className="text-4xl font-bold mb-8 text-cyan-300">Admin: Upload Question</h1>

      <Card className="p-8 bg-white/10 border-white/20 w-full max-w-3xl">
        <Label>Question</Label>
        <textarea
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-4"
          rows={3}
          value={form.question}
          onChange={(e) => set("question", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          {["option_a", "option_b", "option_c", "option_d"].map((opt) => (
            <div key={opt}>
              <Label>{opt.toUpperCase()}</Label>
              <Input
                className="mt-1"
                value={form[opt]}
                onChange={(e) => set(opt, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Label className="mt-4">Correct Option</Label>
        <select
          className="w-full p-3 mt-1 bg-white/10 border-white/20 rounded-xl"
          value={form.correct_option}
          onChange={(e) => set("correct_option", e.target.value)}
        >
          <option>A</option><option>B</option><option>C</option><option>D</option>
        </select>

        <Label className="mt-4">Subject</Label>
        <select
          className="w-full p-3 mt-1 bg-white/10 border-white/20 rounded-xl"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
        >
          <option value="">Select</option>
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Maths</option>
          <option>Biology</option>
        </select>

        <Label className="mt-4">Chapter</Label>
        <Input
          className="mt-1"
          value={form.chapter}
          onChange={(e) => set("chapter", e.target.value)}
        />

        <Label className="mt-4">Difficulty</Label>
        <select
          className="w-full p-3 mt-1 bg-white/10 border-white/20 rounded-xl"
          value={form.difficulty}
          onChange={(e) => set("difficulty", e.target.value)}
        >
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>

        <Label className="mt-4">Target Exam</Label>
        <select
          className="w-full p-3 mt-1 bg-white/10 border-white/20 rounded-xl"
          value={form.exam}
          onChange={(e) => set("exam", e.target.value)}
        >
          <option value="">Select</option>
          <option>JEE</option>
          <option>NEET</option>
          <option>BITSAT</option>
          <option>VITEEE</option>
        </select>

        <Button className="mt-8 bg-emerald-600 hover:bg-emerald-500" onClick={handleSubmit}>
          Upload Question
        </Button>
      </Card>
    </div>
  );
}
