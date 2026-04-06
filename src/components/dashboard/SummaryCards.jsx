import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  ArrowRight,
  Zap,
  Sparkles,
} from "lucide-react";

const SummaryCards = ({ totals, timeRange = "ALL" }) => {
  const { balance = 0, income = 0, expense = 0 } = totals || {};

  // Dynamic description based on Time Range
  const rangeText = useMemo(() => {
    switch (timeRange) {
      case "24H":
        return "Today's";
      case "7D":
        return "Weekly";
      case "1M":
        return "Monthly";
      case "1Y":
        return "Annual";
      default:
        return "Lifetime";
    }
  }, [timeRange]);

  const statsData = useMemo(() => {
    const totalFlow = income + expense;
    const incomePerc =
      totalFlow > 0 ? Math.round((income / totalFlow) * 100) : 0;
    const expensePerc =
      totalFlow > 0 ? Math.round((expense / totalFlow) * 100) : 0;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    return [
      {
        label: "Net Capital",
        value: balance,
        percentage: savingsRate > 100 ? 100 : savingsRate,
        analysis: `${savingsRate}% Retention`,
        icon: <Wallet size={24} />,
        theme: "indigo",
        gradient: "from-indigo-600 to-violet-600",
        desc: `${rangeText} Surplus`,
      },
      {
        label: "Total Inflow",
        value: income,
        percentage: incomePerc,
        analysis: "Revenue Vector",
        icon: <ArrowUpRight size={24} />,
        theme: "emerald",
        gradient: "from-emerald-500 to-teal-600",
        desc: `${rangeText} Revenue`,
      },
      {
        label: "Total Outflow",
        value: expense,
        percentage: expensePerc,
        analysis: `${expensePerc}% Burn Rate`,
        icon: <ArrowDownRight size={24} />,
        theme: "rose",
        gradient: "from-rose-500 to-orange-600",
        desc: `${rangeText} Spend`,
      },
    ];
  }, [balance, income, expense, rangeText]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {statsData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
          className="group relative flex flex-col justify-between overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-800 p-8 rounded-[3.5rem] shadow-2xl shadow-slate-900/5 cursor-pointer">
          {/* --- ABSTRACT STICKER DECOR (The "Flux" look) --- */}
          <div
            className={`absolute -right-6 -top-6 p-10 opacity-[0.05] group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700 text-${item.theme}-500`}>
            <Sparkles size={120} strokeWidth={1} />
          </div>

          <div className="flex justify-between items-start relative z-10">
            {/* Premium Icon Case */}
            <div
              className={`p-5 rounded-[2rem] bg-${item.theme}-500/10 text-${item.theme}-600 dark:text-${item.theme}-400 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              {item.icon}
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200/40 dark:border-white/10 mb-2">
                <Zap
                  size={10}
                  className={`text-${item.theme}-500 animate-pulse`}
                />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {item.desc}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] font-black text-emerald-500">
                <TrendingUp size={12} />
                <span className="tracking-tighter italic">LIVE PROTOCOL</span>
              </div>
            </div>
          </div>

          {/* Amount Section */}
          <div className="mt-10 mb-8 relative z-10">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-2">
              {item.label}
            </h3>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold text-${item.theme}-500 opacity-60`}>
                ₹
              </span>
              <motion.h2
                key={item.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                {item.value.toLocaleString("en-IN")}
              </motion.h2>
            </div>
          </div>

          {/* Analysis & Progress */}
          <div className="relative z-10 pt-6 border-t border-slate-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div
                className={`px-3 py-1 rounded-lg bg-${item.theme}-500/10 text-${item.theme}-600 dark:text-${item.theme}-400 text-[10px] font-black uppercase`}>
                {item.analysis}
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {item.percentage}%
              </span>
            </div>

            {/* Premium Animated Progress Bar */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-[2px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${item.gradient} shadow-[0_0_15px_rgba(0,0,0,0.1)]`}
              />
            </div>
          </div>

          {/* Bottom Hover Glow */}
          <div
            className={`absolute -bottom-12 -left-12 w-32 h-32 bg-${item.theme}-500/10 rounded-full blur-[50px] group-hover:scale-150 transition-all duration-700`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SummaryCards;
