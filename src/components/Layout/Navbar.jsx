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
  X,
} from "lucide-react";

const Navbar = () => {
  const { role, setRole, setIsSidebarOpen } = useContext(AppContext);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile search toggle

  return (
    <nav className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 px-4 md:px-10 flex items-center justify-between transition-all">
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center gap-2 md:gap-6 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl lg:hidden active:scale-90 transition-all">
          <Menu size={20} />
        </button>

        {/* Branding - Optional hidden on tiny mobile */}
        <div className="hidden lg:block mr-2">
          <span className="text-sm font-black uppercase tracking-tighter text-indigo-600">
            Flux<span className="text-slate-900">Core</span>
          </span>
        </div>

        {/* Smart Search Bar */}
        <div
          className={`
          ${isSearchOpen ? "absolute inset-x-0 top-0 h-full bg-white px-4 flex z-50" : "hidden sm:flex"}
          items-center gap-3 bg-gray-100/80 border border-gray-200/50 px-4 py-2 rounded-2xl w-full max-w-[280px] group focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all
        `}>
          <Search
            size={16}
            className="text-gray-400 group-focus-within:text-indigo-600"
          />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-gray-400"
          />
          {isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="sm:hidden">
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Mobile Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl">
          <Search size={20} />
        </button>
      </div>

      {/* --- RIGHT SECTION --- */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Role Switcher - Adaptive UI */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl md:rounded-2xl border border-gray-200/50">
          <button
            onClick={() => setRole("admin")}
            className={`flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
              role === "admin"
                ? "bg-white text-indigo-600 shadow-sm scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            <ShieldCheck size={14} strokeWidth={2.5} />
            <span className="hidden md:inline">Admin</span>
          </button>

          <button
            onClick={() => setRole("viewer")}
            className={`flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
              role === "viewer"
                ? "bg-white text-indigo-600 shadow-sm scale-105"
                : "text-gray-400 hover:text-gray-600"
            }`}>
            <Eye size={14} strokeWidth={2.5} />
            <span className="hidden md:inline">Viewer</span>
          </button>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1 md:gap-4 border-l border-gray-100 pl-2 md:pl-6">
          <button
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
          </button>

          {/* Quick Info - Desktop only */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
            <Zap size={12} fill="currentColor" />
            <span className="text-[9px] font-black uppercase tracking-tighter">
              Pro
            </span>
          </div>

          {/* User Profile - Compact on Mobile */}
          <div className="flex items-center gap-3 group cursor-pointer ml-1">
            <div className="h-9 w-9 md:h-11 md:w-11 rounded-xl md:rounded-[16px] bg-gradient-to-tr from-indigo-600 to-violet-500 p-[2px] shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-all">
              <div className="w-full h-full bg-white rounded-[14px] md:rounded-[14px] overflow-hidden flex items-center justify-center">
                <User size={20} className="text-indigo-600" />
              </div>
            </div>

            <div className="hidden lg:block leading-tight">
              <p className="text-sm font-black text-gray-900 leading-none">
                Nishant Choudhary
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                CS-ID: 2026
              </p>
            </div>
            <ChevronDown
              size={14}
              className="hidden md:block text-gray-400 group-hover:translate-y-0.5 transition-transform"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
