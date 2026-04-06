import React from "react";
import { NavLink } from "react-router-dom";
import { useFinance } from "../../hooks/useFinance";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Settings,
  LogOut,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useFinance();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/" },
    {
      name: "Transactions",
      icon: <ReceiptText size={20} />,
      path: "/transactions",
    },
    { name: "Insights", icon: <PieChart size={20} />, path: "/insights" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/60 flex flex-col transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 group">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 group-hover:rotate-12 transition-transform">
              <Zap className="text-white" size={22} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
              Zorvyn<span className="text-indigo-600">.</span>
            </h1>
          </div>

          <button
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}>
            {window.innerWidth < 1024 ? (
              <X size={24} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-4">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() =>
                window.innerWidth < 1024 && setIsSidebarOpen(false)
              }
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 translate-x-1"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }>
              <span className="relative z-10 transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="relative z-10">{item.name}</span>

              {/* Active Indicator Glow */}
              <NavLink to={item.path}>
                {({ isActive }) =>
                  isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-indigo-600 rounded-2xl -z-0"
                    />
                  )
                }
              </NavLink>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50 mb-2">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <HelpCircle size={18} className="text-indigo-500" />
              <span className="text-xs font-bold">Need Help?</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Check our documentation or contact support.
            </p>
          </div>

          <button className="flex w-full items-center gap-3 px-4 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Floating Reveal Button */}
      {!isSidebarOpen && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex fixed top-1/2 -translate-y-1/2 left-0 z-50 p-2 bg-indigo-600 text-white rounded-r-xl shadow-lg shadow-indigo-500/30 hover:pr-4 transition-all"
          onClick={() => setIsSidebarOpen(true)}>
          <ChevronRight size={20} />
        </motion.button>
      )}
    </>
  );
};

export default Sidebar;
