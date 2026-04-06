import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Calendar, Zap, LayoutDashboard } from "lucide-react";

// Components
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionTable from "../components/transactions/TransactionTable";
import Insights from "../components/dashboard/Insights";
import BalanceChart from "../components/visualizations/BalanceChart";
import CategoryChart from "../components/visualizations/CategoryChart";
import AddTransactionForm from "../components/admin/AddTransactionForm";

export default function Dashboard() {
  const { transactions, role, timeRange, setTimeRange } = useFinance();

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const amt = Number(t.amount) || 0;
        const type = t.type?.toLowerCase();
        if (type === "income") acc.income += amt;
        else if (type === "expense") acc.expense += amt;
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  // Optimized class for mobile: Less padding, smaller rounded corners
  const chartCardClass =
    "bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl p-4 sm:p-6 lg:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl relative overflow-visible";

  return (
    <div className="min-h-screen w-full bg-[#F9F9F7] dark:bg-slate-950 relative overflow-x-hidden transition-colors duration-700">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Main Container: Adjusting horizontal padding for mobile */}
      <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-screen-2xl mx-auto pb-12 sm:pb-24 px-3 sm:px-10 relative z-10">
        {/* 1. BRANDED HEADER: Scaled down text for mobile */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 sm:pt-12 pb-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1 sm:mb-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg backdrop-blur-md border border-indigo-500/10">
                <Zap size={14} fill="currentColor" className="animate-pulse" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80">
                Dashboard
              </span>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Zorvyn
              <br className="hidden sm:block" />
              <span className="pb-5 relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-500 to-fuchsia-500 ml-0 sm:ml-[-5px]">
                Intelligence
              </span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Calendar size={14} className="text-indigo-500" />
              <span className="font-black text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-widest">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* 2. FILTERS: Horizontal scroll on mobile */}
        <div className="relative z-20 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex gap-1 p-1 bg-slate-200/40 dark:bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
            {["24H", "7D", "1M", "1Y", "ALL"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[10px] font-black tracking-widest transition-all ${
                  timeRange === t
                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-md scale-105"
                    : "text-slate-500"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. SUMMARY CARDS */}
        <div className="relative z-10 -mx-1 sm:mx-0">
          <SummaryCards totals={totals} />
        </div>

        {/* 4. VISUALIZATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-[50]">
          <motion.div
            className={`${chartCardClass} lg:col-span-7 xl:col-span-8 min-h-[450px] sm:min-h-[550px] relative z-[30] overflow-visible p-6 sm:p-8`}>
            {/* Header Section: Icon and Title */}
            <div className="flex items-center gap-3 mb-8 ml-2">
              <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Zap size={18} className="text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 italic">
                  Cashflow{" "}
                  <span className="text-slate-900 dark:text-white">
                    Analytics
                  </span>
                </h3>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  Real-time Balance Overview
                </span>
              </div>
            </div>

            {/* Chart Container: Height aur Padding handle karne ke liye */}
            <div className="w-full h-[350px] sm:h-[400px] mt-4 relative overflow-visible">
              <BalanceChart transactions={transactions} />
            </div>

            {/* Optional: Padding Bottom bottom space maintain karne ke liye */}
            <div className="pb-10" />
          </motion.div>

          {/* 2. Allocation Split Container: Ismein z-[10] ya z-0 rakhein */}
          <motion.div
            className={`${chartCardClass} lg:col-span-5 xl:col-span-4 min-h-[400px] sm:min-h-[500px] relative z-[10]`}>
            <h3 className="font-black text-slate-900 dark:text-white mb-4 sm:mb-8 italic uppercase text-[9px] sm:text-[10px] tracking-widest">
              Allocation Split
            </h3>
            <div className="flex-grow w-full flex items-center justify-center">
              <CategoryChart transactions={transactions} />
            </div>
          </motion.div>
        </div>

        {/* 5. ADMIN SECTION: Edge to edge on mobile */}
        <AnimatePresence>
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full relative z-[10] -mx-1 sm:mx-0">
              <AddTransactionForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. INSIGHTS & TRANSACTIONS */}
        <div className="space-y-6 sm:space-y-8 relative z-[5]">
          <Insights transactions={transactions} />

          {/* Card Container: p-0 rakha hai taaki table edges tak touch ho sake */}
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-slate-200/60 dark:border-slate-800 p-0 shadow-2xl overflow-hidden">
            {/* Header: Sirf isme padding di hai taaki title align rahe */}
            <div className="px-6 py-5 sm:px-8 sm:py-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-slate-900 dark:bg-white rounded-lg">
                  <LayoutDashboard
                    size={14}
                    className="text-white dark:text-slate-900"
                  />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white italic uppercase text-[10px] tracking-widest">
                  Master Ledger
                </h3>
              </div>
            </div>

            {/* Table Wrapper: overflow-x-auto mobile par scroll allow karega, aur w-full edges touch karega */}
            <div className="w-full overflow-x-auto custom-scrollbar">
              <TransactionTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
