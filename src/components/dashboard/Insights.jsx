import React, { useContext, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  PieChart,
  Info,
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

  const cardClass =
    "relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl group";

  return (
    <div className="mt-8 relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Zap size={18} fill="currentColor" className="animate-pulse" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">
          Smart <span className="text-indigo-500">Analytics</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Insight 1: Highest Spending */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`${cardClass} bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20">
              <PieChart size={18} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Core Focus
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-black uppercase tracking-wider">
            Top Category
          </p>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">
            {highestSpending ? highestSpending[0] : "No Data"}
          </h4>
          <p className="text-xs text-indigo-500 font-bold mt-2 tabular-nums">
            ₹{highestSpending ? highestSpending[1].toLocaleString() : 0} Total
          </p>
          <div className="absolute -bottom-6 -right-6 text-indigo-500/5 group-hover:scale-125 transition-transform duration-700">
            <PieChart size={100} />
          </div>
        </motion.div>

        {/* Insight 2: Monthly Change */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`${cardClass} bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 hover:shadow-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-xl border ${monthlyComparison.percent > 0 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}>
              {monthlyComparison.percent > 0 ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Trend Cycle
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-black uppercase tracking-wider">
            Monthly Shift
          </p>
          <h4
            className={`text-2xl font-black italic tracking-tighter ${monthlyComparison.percent > 0 ? "text-rose-500" : "text-emerald-500"}`}>
            {monthlyComparison.percent > 0
              ? `+${monthlyComparison.percent}`
              : monthlyComparison.percent}
            %
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-2">
            vs previous period
          </p>
        </motion.div>

        {/* Insight 3: AI Observation */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-6 rounded-[2rem] bg-slate-900 dark:bg-indigo-950/40 text-white shadow-2xl border border-white/5 group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2 bg-white/10 text-white rounded-xl backdrop-blur-md">
              <Sparkles size={18} className="text-indigo-300" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">
              Smart Engine
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-white/50 mb-2 font-black uppercase tracking-widest">
              Core Suggestion
            </p>
            <h4 className="text-[15px] font-bold leading-relaxed italic pr-4">
              {monthlyComparison.percent > 0
                ? "Velocity detected. Outflow exceeding monthly norms. Adjust tactical spending. ⚠️"
                : "Efficiency optimized. Outflow reduced. Core balance strengthening. Keep it up! 🏆"}
            </h4>
          </div>
          {/* Subtle tech patterns in background */}
          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
            <Zap size={80} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Insights;
