"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const subjectsByExam: any = {
  JEE: ["Physics", "Chemistry", "Maths"],
  NEET: ["Physics", "Chemistry", "Biology"],
  BITSAT: ["Physics", "Chemistry", "Maths"],
  VITEEE: ["Physics", "Chemistry", "Maths"]
};

export default function ReferenceBooksPage() {
  const [user, setUser] = useState<any>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      setUser(parsed);

      const firstSubject = subjectsByExam[parsed.exam]?.[0];
      setSubject(firstSubject || null);

      if (firstSubject) loadBooks(parsed.exam, firstSubject);
    }
  }, []);

  async function loadBooks(exam: string, subj: string) {
    const res = await fetch(`/api/list-reference-books?exam=${exam}&subject=${subj}`);
    const data = await res.json();
    setFiles(data.files || []);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-6
      bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 text-white">

      <h1 className="text-5xl font-extrabold mb-10 text-center bg-gradient-to-r 
        from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        Reference Books — {user.exam}
      </h1>

      {/* SUBJECT SELECTOR */}
      <div className="flex gap-4 mb-10 flex-wrap justify-center">
        {subjectsByExam[user.exam].map((s: string) => (
          <Button
            key={s}
            onClick={() => {
              setSubject(s);
              loadBooks(user.exam, s);
            }}
            className={`px-6 py-3 text-xl rounded-xl ${
              subject === s ? "bg-emerald-600" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* BOOK LIST */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {files.map((file, idx) => {
          const downloadPath = `/reference-books/${user.exam}/${subject}/${file}`;

          return (
            <Card
              key={idx}
              className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl"
            >
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">{file.replace(".zip", "")}</h2>

              <Button
                className="bg-indigo-600 hover:bg-indigo-500 text-lg"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = downloadPath;
                  link.download = file;
                  link.click();
                }}
              >
                Download ZIP
              </Button>
            </Card>
          );
        })}

        {files.length === 0 && (
          <p className="text-gray-300 text-2xl text-center mt-10">
            No reference books uploaded yet for {subject}.
          </p>
        )}
      </div>
    </div>
  );
}

