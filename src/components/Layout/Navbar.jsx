import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import {
  User,
  ShieldCheck,
  Eye,
  Menu,
  Moon,
  Sun,
  Zap,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { role, setRole, setIsSidebarOpen, theme, toggleTheme } =
    useContext(AppContext);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="h-20 w-full sticky top-0 z-50 px-4 md:px-10 flex items-center justify-between transition-all duration-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      {/* --- LEFT: Brand & Mobile Menu --- */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl lg:hidden transition-colors">
          <Menu size={22} />
        </motion.button>

        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
            <Zap size={20} className="text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-none">
              Zorvyn<span className="text-indigo-600">.</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT: Controls & Profile --- */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Role Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl transition-all">
            {role === "admin" ? (
              <ShieldCheck size={16} className="text-indigo-500" />
            ) : (
              <Eye size={16} className="text-emerald-500" />
            )}
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hidden sm:block">
              {role}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-300 ${isRoleOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence>
            {isRoleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden p-1.5">
                <button
                  onClick={() => {
                    setRole("admin");
                    setIsRoleOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                    role === "admin"
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}>
                  <ShieldCheck size={16} /> Admin Access
                </button>
                <button
                  onClick={() => {
                    setRole("viewer");
                    setIsRoleOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                    role === "viewer"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}>
                  <Eye size={16} /> Viewer Mode
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-amber-400 border border-transparent dark:border-slate-700 transition-all shadow-inner">
          {theme === "light" ? (
            <Moon size={18} fill="currentColor" />
          ) : (
            <Sun size={18} fill="currentColor" />
          )}
        </motion.button>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center relative">
                <User
                  size={20}
                  className="text-slate-700 dark:text-slate-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
              N. Choudhary
            </p>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.15em] mt-1">
              Premium Account
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
