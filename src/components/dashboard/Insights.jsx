import React, { useContext, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  PieChart,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const Insights = () => {
  const { transactions = [] } = useContext(AppContext);

  // 1. Highest Spending Logic
  const highestSpending = useMemo(() => {
    const expenses = transactions.filter(
      (t) => t.type?.toLowerCase() === "expense",
    );
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    return sorted[0]; // [category, amount]
  }, [transactions]);

  // 2. Monthly Comparison Logic
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentTotal = 0;
    let prevTotal = 0;

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (t.type?.toLowerCase() === "expense") {
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        )
          currentTotal += Number(t.amount);
        if (date.getMonth() === prevMonth && date.getFullYear() === prevYear)
          prevTotal += Number(t.amount);
      }
    });

    const diff = currentTotal - prevTotal;
    const percent = prevTotal ? ((diff / prevTotal) * 100).toFixed(1) : 0;

    return { currentTotal, prevTotal, percent: Number(percent) };
  }, [transactions]);

  // क्रेड्स के लिए क्लास (अंदरूनी कार्ड्स)
  const innerCardClass =
    "relative overflow-hidden p-5 rounded-[1.5rem] border transition-all duration-500 backdrop-blur-xl group h-full";

  return (
    // 🔥 मुख्य बाहरी कंटेनर - जो इसे अन्य कंपोनेंट्स जैसा "कार्ड" लुक देता है
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 relative z-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden">
      {/* Background Decor Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Zap size={18} fill="currentColor" className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight leading-none">
              Smart <span className="text-indigo-500">Analytics</span>
            </h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              AI Powered Financial Observations
            </span>
          </div>
        </div>

        {/* Optional: Info icon */}
        <Sparkles size={16} className="text-slate-300 dark:text-slate-600" />
      </div>

      {/* Grid Container for Inner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {/* Insight 1: Highest Spending */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`${innerCardClass} bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5`}>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20">
              <PieChart size={16} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Core Focus
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-1 font-black uppercase tracking-wider">
              Top Category
            </p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter truncate">
              {highestSpending ? highestSpending[0] : "No Data"}
            </h4>
            <p className="text-xs text-indigo-500 font-bold mt-1.5 tabular-nums">
              ₹
              {highestSpending ? highestSpending[1].toLocaleString("en-IN") : 0}{" "}
              Total
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 text-indigo-500/5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
            <PieChart size={80} />
          </div>
        </motion.div>

        {/* Insight 2: Monthly Change */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`${innerCardClass} bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 hover:shadow-xl`}>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div
              className={`p-2 rounded-lg border ${monthlyComparison.percent > 0 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}>
              {monthlyComparison.percent > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Trend Cycle
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-1 font-black uppercase tracking-wider">
              Monthly Shift
            </p>
            <h4
              className={`text-xl font-black italic tracking-tighter ${monthlyComparison.percent > 0 ? "text-rose-500" : "text-emerald-500"}`}>
              {monthlyComparison.percent > 0
                ? `+${monthlyComparison.percent}`
                : monthlyComparison.percent}
              %
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-1.5">
              vs previous period
            </p>
          </div>
        </motion.div>

        {/* Insight 3: AI Observation - Special Styling */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-[1.5rem] bg-slate-900 dark:bg-indigo-950/60 text-white shadow-xl border border-white/5 group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2 bg-white/10 text-white rounded-lg backdrop-blur-md">
              <Sparkles size={16} className="text-indigo-300" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 italic">
              Smart Engine
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[9px] text-white/50 mb-1.5 font-black uppercase tracking-widest">
              Core Suggestion
            </p>
            <h4 className="text-xs md:text-[13px] font-bold leading-relaxed italic pr-2 text-indigo-50">
              {monthlyComparison.percent > 0
                ? "Velocity detected. Outflow exceeding monthly norms. Adjust tactical spending. ⚠️"
                : "Efficiency optimized. Outflow reduced. Core balance strengthening. Keep it up! 🏆"}
            </h4>
          </div>
          {/* Subtle tech patterns in background */}
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000 pointer-events-none">
            <Zap size={80} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Insights;
