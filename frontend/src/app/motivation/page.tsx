"use client";
import { useEffect, useState } from "react"; 
import { Card } from "@/components/ui/card";
import { Flame, Crown, Swords, Zap, Target, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const quotes = [
  "Most people quit when they're tired. Winners quit when they've won.",
  "Comfort is the enemy of greatness.",
  "Your rank will be exactly equal to your discipline. No exceptions.",
  "While others are scrolling, you're building an empire.",
  "Pain today. Pride forever.",
  "The version of you that exists in 2026 is counting on you right now.",
  "Legends don't wait for motivation. They become it.",
  "Every second you waste, someone else is getting closer to your dream.",
  "You don't rise to the occasion. You fall to the level of your training.",
  "The throne doesn't care how you feel. It only respects results."
];

export default function MotivationPage() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-90" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            WHERE KNOWLEDGE MEETS MOMENTUM
          </h1>
        </motion.div>

        {/* Main Motivation Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl w-full"
        >
          <Card className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border border-zinc-800 p-16 md:p-24 shadow-2xl">
            <div className="text-center space-y-16">
              
              {/* Icons Circle */}
              <div className="flex justify-center gap-8 mb-12">
                <Flame className="w-16 h-16 text-orange-500 animate-pulse" />
                <Crown className="w-16 h-16 text-yellow-500" />
                <Swords className="w-16 h-16 text-red-600 animate-pulse" />
              </div>

              {/* Dynamic Quote */}
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1 }}
                className="min-h-48 flex items-center justify-center"
              >
                <p className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-100 leading-tight px-8">
                  "{quotes[currentQuote]}"
                </p>
              </motion.div>

              {/* Bottom Icons */}
              <div className="flex justify-center gap-12 mt-20">
                <Zap className="w-12 h-12 text-yellow-400 animate-pulse" />
                <Target className="w-12 h-12 text-green-500" />
                <Rocket className="w-12 h-12 text-blue-500 animate-pulse" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="text-center mt-20"
        >
          <p className="text-3xl md:text-5xl font-black text-zinc-500 tracking-widest">
            THIS IS NOT A PHASE
          </p>
          <p className="text-2xl md:text-4xl font-light text-zinc-600 mt-4">
            THIS IS WHO YOU ARE BECOMING
          </p>
        </motion.div>
      </div>
    </div>
  );
}