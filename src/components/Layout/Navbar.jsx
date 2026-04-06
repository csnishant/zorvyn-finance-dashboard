import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import {
  ShieldCheck,
  Eye,
  Menu,
  Moon,
  Sun,
  Zap,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { role, setRole, setIsSidebarOpen, theme, toggleTheme } =
    useContext(AppContext);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <nav className="h-16 md:h-20 w-full sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between transition-all duration-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      {/* --- LEFT: Brand & Sidebar Toggle --- */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden">
          <Menu size={20} />
        </motion.button>

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
            <Zap size={18} className="text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-none">
              Zorvyn<span className="text-indigo-600">.</span>
            </span>
            <span className="hidden xs:block text-[8px] md:text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* --- RIGHT: Controls (Responsive) --- */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Role Selector - Optimized for Mobile */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-xl md:rounded-2xl transition-all">
            {role === "admin" ? (
              <ShieldCheck size={16} className="text-indigo-500" />
            ) : (
              <Eye size={16} className="text-emerald-500" />
            )}
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hidden sm:inline-block">
              {role}
            </span>
            <ChevronDown
              size={12}
              className={`text-slate-400 transition-transform duration-300 ${isRoleOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence>
            {isRoleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-40 md:w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden p-1.5">
                <button
                  onClick={() => {
                    setRole("admin");
                    setIsRoleOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] md:text-xs font-bold transition-colors ${
                    role === "admin"
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}>
                  <ShieldCheck size={15} /> Admin
                </button>
                <button
                  onClick={() => {
                    setRole("viewer");
                    setIsRoleOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] md:text-xs font-bold transition-colors ${
                    role === "viewer"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}>
                  <Eye size={15} /> Viewer
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
          className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-amber-400 border border-transparent dark:border-slate-700 transition-all shadow-inner">
          {theme === "light" ? (
            <Moon size={18} fill="currentColor" />
          ) : (
            <Sun size={18} fill="currentColor" />
          )}
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
