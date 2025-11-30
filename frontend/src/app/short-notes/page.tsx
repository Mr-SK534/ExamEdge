'use client';

import { useEffect, useState } from "react";
import { BookOpen, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

type UserType = {
  name: string;
  email: string;
  exam: string;
};

const SHORT_NOTES: Record<string, { name: string; id: string }[]> = {
  physics: [
    { name: "Complete Physics Short Notes", id: "16qOf4iIDfojrFMdqtA_mS1BqSnu0DKvH" },
  ],
  chemistry: [
    { name: "Complete Chemistry Short Notes", id: "1r-4QsixeuIBu07dT1DJ2w9fMiMpkMYtb" },
  ],
  maths: [
    { name: "Complete Maths Short Notes", id: "1eCsy_Qow0ulU3ajdB1Bm3E-IsIBjnuwK" },
  ]
};

export default function ShortNotesPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u) setUser(u);
  }, []);

  if (!user) return null;

  const notes = SHORT_NOTES[selectedSubject];

  const handleDownload = (id: string, name: string) => {
    const link = `https://drive.google.com/uc?export=download&id=${id}`;
    const a = document.createElement('a');
    a.href = link;
    a.download = `ExamEdge_${name.replace(/ /g, '_')}.zip`;
    a.click();
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />
      
      <div className="relative min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Header - EXACT SAME AS QUESTION PAPER PAGE */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-cyan-300 mb-4">
              Short Notes
            </h1>
            <p className="text-cyan-100 text-xl md:text-2xl">
              Last Minute Revision • Formula Sheets • Handwritten Style
            </p>
          </div>

          {/* Back Button */}
          <Link href="/dashboard" className="fixed top-8 left-8 text-cyan-300 hover:text-white flex items-center gap-2 text-lg font-bold z-50">
            <ArrowLeft /> Back to Dashboard
          </Link>

          {/* Subject Buttons - EXACT SAME SIZE AS QUESTION PAPER */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {Object.keys(SHORT_NOTES).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-10 py-5 rounded-2xl text-2xl font-bold transition-all capitalize
                  ${selectedSubject === sub 
                    ? "bg-emerald-500 text-white shadow-2xl scale-110" 
                    : "bg-white/10 text-cyan-200 border border-white/30 hover:bg-white/20"
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Notes Cards - EXACT SAME AS QUESTION PAPER PAGE */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="space-y-8">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <BookOpen className="w-16 h-16 text-cyan-400" />
                        <div>
                          <h3 className="text-3xl font-bold text-white">
                            {note.name}
                          </h3>
                          <p className="text-cyan-200 mt-2">High Quality • Best for Final Revision</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(note.id, note.name)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg"
                      >
                        <Download className="w-6 h-6" /> Download ZIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {notes.length === 0 && (
                <div className="text-center text-cyan-200 text-3xl font-bold py-20">
                  No notes available for {selectedSubject}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-24 text-cyan-200">
            <p className="text-2xl font-bold">
              Made with ❤️ for Last Minute Warriors
            </p>
          </div>
        </div>
      </div>
    </>
  );
}