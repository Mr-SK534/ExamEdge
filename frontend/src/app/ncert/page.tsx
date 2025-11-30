'use client';
import Link from 'next/link';
import { Download, BookOpen, ArrowLeft } from 'lucide-react';

const ncertBooks = {
  "Class 11": [
    { name: "Physics Part 1",      id: "1265-CiIF_MCrC1hHgIAhPKoIHt2UUVB9" },
    { name: "Physics Part 2",      id: "1uZ4g4D3CS8vVBzflSbRYkH_VmX3FwnRy" },
    { name: "Chemistry Part 1",    id: "1M7UWAbCjb7b4Ydwej2OIw4h0X32jT1v5" },
    { name: "Chemistry Part 2",    id: "1bzo1IiNXqFptdAkcC7bF1Wyl6cO2CU16" },
    { name: "Mathematics",         id: "1E09gFCDWdMQcpsd6P9QVXl4ZL9dNbRC3" },
    { name: "Biology",             id: "1m7XissbALCgYxvv8TTzHVkgSieD7keaY" },
  ],
  "Class 12": [
    { name: "Physics Part 1",      id: "1Sc2N8OTWeXHAkhmnWt8-yTQ8auNFb2D3" },
    { name: "Physics Part 2",      id: "1QDSL8OKDQw0LlaxQM_qH4K_ObqYRxMcE" },
    { name: "Chemistry Part 1",    id: "1jMNrhT04JQMTvE_bwld7EXJgfSJjvJUx" },
    { name: "Chemistry Part 2",    id: "1gcXqUF52_YVR2yoWbSZytsHBrtslUvT9" },
    { name: "Mathematics Part 1",  id: "15CcrTqHyg5vpgwJDrmqcnEHkQLG3YjaG" },
    { name: "Mathematics Part 2",  id: "13yWc4-frmFi7fQ-i56RZTarEvlT5tXSA" },
    { name: "Biology",             id: "1egfgQnVaNa1GuU7eDMRZEZFkl_wzvStK" },
  ]
};

export default function NCERTPage() {
  const handleDownload = (id: string, name: string) => {
    const link = `https://drive.google.com/uc?export=download&id=${id}`;
    const a = document.createElement('a');
    a.href = link;
    a.download = `ExamEdge_${name.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 via-blue-800 to-indigo-900" />
      
      <div className="relative min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-cyan-300 mb-4 tracking-tighter">
              NCERT Books
            </h1>
            <p className="text-cyan-100 text-xl md:text-2xl font-medium">
              Instant Download • Latest Edition • Made for Champions
            </p>
          </div>

          {/* Back Button */}
          <Link href="/dashboard" className="fixed top-8 left-8 bg-black/30 backdrop-blur-md text-cyan-300 hover:text-white flex items-center gap-3 text-lg font-bold z-50 px-6 py-3 rounded-full border border-cyan-500/50 hover:border-cyan-400 transition">
            <ArrowLeft size={24} /> Dashboard
          </Link>

          {/* Books Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {Object.entries(ncertBooks).map(([className, books]) => (
              <div key={className} className="backdrop-blur-2xl bg-white/10 rounded-3xl p-10 border border-white/20 shadow-2xl">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10 text-center">
                  {className}
                </h2>
                <div className="space-y-6">
                  {books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleDownload(book.id, book.name)}
                      className="w-full flex items-center justify-between gap-6 p-8 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/30 transition-all group hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-2xl group-hover:scale-110 transition">
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-xl tracking-wide">{book.name}</p>
                          <p className="text-cyan-200 text-sm mt-1">High Quality • Direct Download</p>
                        </div>
                      </div>
                      <div className="bg-cyan-600 group-hover:bg-cyan-500 p-5 rounded-full transition-all group-hover:scale-110">
                        <Download className="w-9 h-9 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20 text-cyan-200">
            <p className="text-lg font-medium">Made with ❤️ for JEE & NEET Warriors</p>
          </div>
        </div>
      </div>
    </>
  );
}