// frontend/src/components/Navbar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Trophy,
  Clock,
  MessageCircle,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Question Bank", href: "/question-bank", icon: Trophy },
  { name: "Mock Tests", href: "/mock-test", icon: Clock },
  { name: "AI Doubt Solver", href: "/ai-doubt-solver", icon: MessageCircle },
  { name: "Resources", href: "/resource-library", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart3 },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Top Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-blue/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center font-bold text-xl">
                EE
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">ExamEdge</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 transition">
                <User className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-blue/98 border-t border-white/10">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}