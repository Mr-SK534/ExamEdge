// frontend/src/components/Sidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Clock,
  MessageCircle,
  BookOpen,
  BarChart3,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Question Bank", href: "/question-bank", icon: Trophy },
  { name: "Mock Tests", href: "/mock-test", icon: Clock },
  { name: "AI Doubt Solver", href: "/ai-doubt-solver", icon: MessageCircle },
  { name: "Resources", href: "/resource-library", icon: BookOpen },
  { name: "Progress", href: "/progress", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    window.location.href = "/login";
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-dark-blue/90 backdrop-blur-md border-r border-white/10">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center font-bold text-xl">
            EE
          </div>
          <span className="text-xl font-bold text-white">ExamEdge</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}