import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  User,
  ShieldCheck,
  Eye,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Zap,
  CheckCircle2,
} from "lucide-react";

const Navbar = () => {
  const { role, setRole, setIsSidebarOpen } = useContext(AppContext);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  return (
    <nav className="h-20 bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-all duration-500">
      {/* LEFT: Branding & Search */}
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl lg:hidden active:scale-95 transition-all">
          <Menu size={22} />
        </button>

        {/* Global Search Bar - Hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-3 bg-gray-100/50 border border-gray-200/50 px-4 py-2 rounded-2xl w-full max-w-xs group focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
          <Search
            size={16}
            className="text-gray-400 group-focus-within:text-indigo-600"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-gray-400"
          />
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-black text-gray-400 bg-white border rounded shadow-sm">
            K
          </kbd>
        </div>
      </div>

      {/* RIGHT: Role Switcher & Profile */}
      <div className="flex items-center gap-2 md:gap-5">
        {/* Role Switcher - Ultra Responsive */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/50 shadow-inner">
          <button
            onClick={() => setRole("admin")}
            className={`relative flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tighter transition-all duration-500 ${
              role === "admin"
                ? "bg-white text-indigo-600 shadow-md scale-105 z-10"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            <ShieldCheck size={14} strokeWidth={2.5} />
            <span className="hidden md:inline">Administrator</span>
            {role === "admin"}
          </button>

          <button
            onClick={() => setRole("viewer")}
            className={`relative flex items-center gap-2 px-3 md:px-5 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tighter transition-all duration-500 ${
              role === "viewer"
                ? "bg-white text-indigo-600 shadow-md scale-105 z-10"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            <Eye size={14} strokeWidth={2.5} />
            <span className="hidden md:inline">Viewer Mode</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 md:gap-3 border-l border-gray-100 pl-2 md:pl-5">
          <button
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className="relative p-2.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all group active:scale-90">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
          </button>

          {/* Quick Stats - Desktop Only */}
          <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase">Pro Plan</span>
          </div>
        </div>

        {/* User Profile - Squircle Design */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-[18px] bg-indigo-600 p-0.5 shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[16px] overflow-hidden flex items-center justify-center">
              <User size={22} className="text-indigo-600" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-1">
              <p className="text-sm font-black text-gray-900">Nishant C.</p>
              <ChevronDown
                size={14}
                className="text-gray-400 group-hover:translate-y-0.5 transition-transform"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
              SAT-ID: 2026
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
