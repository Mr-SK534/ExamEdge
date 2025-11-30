'use client';

import { useEffect, useState } from "react";
import { BookOpen, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

type UserType = {
  name: string;
  email: string;
  exam: "JEE" | "NEET" | "BITSAT" | "VITEEE";
};


const REFERENCE_BOOKS: Record<string, Record<string, { name: string; id: string }[]>> = {
  JEE: {
    Physics: [
      { name: "Physics Vol-1", id: "11m3WMbu2vt43Jx3_Sr-zT0VShxag6FLf" },
      { name: "Physics Vol-2", id: "1GOVsNpg7k-hJnNnJbV-FJhjDGUHZd7x1" },
      
    ],
    Chemistry: [
      { name: "MS Chauhan Organic", id: "1u8OF4_Pxh0o13JXjkR6P-2LzKml6Hidc" },
      { name: "N Awasthi Physical", id: "1KcJ27V-rt20NbPI3Jy6esAOvBNxFzLxq" },
      
    ],
    Maths: [
      { name: "Arihant Skills in Mathematics", id: "1uNJN2pU_XJgNRKHC9maDjrshVHyacHC1" },

    ]
  },
  NEET: {
   Physics: [
      { name: "Physics Vol-1", id: "11m3WMbu2vt43Jx3_Sr-zT0VShxag6FLf" },
      { name: "Physics Vol-2", id: "1GOVsNpg7k-hJnNnJbV-FJhjDGUHZd7x1" },
      
    ],
    Chemistry: [
      { name: "MS Chauhan Organic", id: "1u8OF4_Pxh0o13JXjkR6P-2LzKml6Hidc" },
      { name: "N Awasthi Physical", id: "1KcJ27V-rt20NbPI3Jy6esAOvBNxFzLxq" },
      
    ],
  },
  BITSAT: {
    Physics: [
      { name: "Physics Vol-1", id: "11m3WMbu2vt43Jx3_Sr-zT0VShxag6FLf" },
      { name: "Physics Vol-2", id: "1GOVsNpg7k-hJnNnJbV-FJhjDGUHZd7x1" },
      
    ],
    Chemistry: [
      { name: "MS Chauhan Organic", id: "1u8OF4_Pxh0o13JXjkR6P-2LzKml6Hidc" },
      { name: "N Awasthi Physical", id: "1KcJ27V-rt20NbPI3Jy6esAOvBNxFzLxq" },
      
    ],
    Maths: [
      { name: "Arihant Skills in Mathematics", id: "1uNJN2pU_XJgNRKHC9maDjrshVHyacHC1" },

    ]
  },
  VITEEE: {
    Physics: [
      { name: "Physics Vol-1", id: "11m3WMbu2vt43Jx3_Sr-zT0VShxag6FLf" },
      { name: "Physics Vol-2", id: "1GOVsNpg7k-hJnNnJbV-FJhjDGUHZd7x1" },
      
    ],
    Chemistry: [
      { name: "MS Chauhan Organic", id: "1u8OF4_Pxh0o13JXjkR6P-2LzKml6Hidc" },
      { name: "N Awasthi Physical", id: "1KcJ27V-rt20NbPI3Jy6esAOvBNxFzLxq" },
      
    ],
    Maths: [
      { name: "Arihant Skills in Mathematics", id: "1uNJN2pU_XJgNRKHC9maDjrshVHyacHC1" },

    ]
  }
};

export default function ReferenceBooksPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.exam) {
      setUser(u);
      const subjects = Object.keys(REFERENCE_BOOKS[u.exam] || {});
      setSelectedSubject(subjects[0] || "");
    }
  }, []);

  if (!user) return null;

  const subjects = Object.keys(REFERENCE_BOOKS[user.exam] || {});
  const books = REFERENCE_BOOKS[user.exam]?.[selectedSubject] || [];

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

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-cyan-300 mb-4">
              Reference Books
            </h1>
            <p className="text-cyan-100 text-xl md:text-2xl">
              Best Books • Complete Sets • Instant Download
            </p>
          </div>

          {/* Back Button */}
          <Link href="/dashboard" className="fixed top-8 left-8 text-cyan-300 hover:text-white flex items-center gap-2 text-lg font-bold z-50">
            <ArrowLeft /> Back to Dashboard
          </Link>

          {/* Subject Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-12 py-6 rounded-3xl text-3xl font-bold transition-all shadow-2xl
                  ${selectedSubject === subj
                    ? "bg-emerald-500 text-white scale-110"
                    : "bg-white/10 text-cyan-200 border-2 border-white/40 hover:bg-white/20 hover:scale-105"
                  }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Books List - SINGLE CENTERED CARDS (like NCERT page) */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl space-y-8">
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 border border-white/20 hover:bg-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <BookOpen className="w-20 h-20 text-cyan-400" />
                        <div>
                          <h3 className="text-4xl font-extrabold text-white">
                            {book.name}
                          </h3>
                          <p className="text-cyan-200 text-xl mt-3">Complete Set • High Quality PDF</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(book.id, book.name)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-4 shadow-2xl hover:scale-110 transition-all"
                      >
                        <Download className="w-8 h-8" /> Download 
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-cyan-200 text-4xl font-bold py-20">
                  No books uploaded yet for {selectedSubject}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-24 text-cyan-200">
            <p className="text-2xl font-bold">
              Made with ❤️ for {user.exam} Warriors
            </p>
          </div>
        </div>
      </div>
    </>
  );
}