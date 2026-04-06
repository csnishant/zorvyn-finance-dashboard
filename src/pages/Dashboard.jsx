import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Calendar, Zap, LayoutDashboard, Layers } from "lucide-react";

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

  /** * FIX 1: Removed 'overflow-hidden' from chartCardClass.
   * Added 'relative' and 'z-index' to ensure it stays above lower sections.
   */
  const chartCardClass =
    "bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl p-6 lg:p-8 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 transition-all duration-500 hover:shadow-indigo-500/10 flex flex-col group relative overflow-visible";

  return (
    <div className="min-h-screen w-full transition-colors duration-700 bg-[#F9F9F7] dark:bg-slate-950 relative overflow-x-hidden">
      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex flex-col gap-8 w-full max-w-screen-2xl mx-auto pb-24 px-4 sm:px-10 relative z-10">
        {/* 1. BRANDED HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-12 pb-6 relative z-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
            className="space-y-1">
            <motion.div
              variants={{
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
              <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl backdrop-blur-md border border-indigo-500/10">
                <Zap size={16} fill="currentColor" className="animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80">
                Dashboard
              </span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85]">
              Zorvyn
              <br />
              <span className="p-3 relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-500 to-fuchsia-500">
                Intelligence
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Calendar size={18} className="text-indigo-500" />
              <span className="font-black text-slate-700 dark:text-slate-300 text-xs uppercase tracking-widest tabular-nums">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </header>

        {/* 2. FILTERS */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1.5 p-1.5 bg-slate-200/40 dark:bg-slate-800/40 backdrop-blur-md w-fit rounded-2xl border border-slate-200 dark:border-slate-700">
            {["24H", "7D", "1M", "1Y", "ALL"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] transition-all duration-300 ${
                  timeRange === t
                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105"
                    : "text-slate-500 hover:text-slate-900"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. SUMMARY CARDS */}
        <div className="relative z-10">
          <SummaryCards totals={totals} />
        </div>

        {/* 4. VISUALIZATION GRID - CRITICAL FIX FOR OVERFLOW/Z-INDEX */}
        {/* We wrap the grid in a container with a high z-index and overflow visible */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-[50]">
          <motion.div
            className={`${chartCardClass} lg:col-span-7 xl:col-span-8 min-h-[500px] z-[60]`}>
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 italic uppercase text-[10px] tracking-[0.2em]">
                  <Activity size={16} className="text-indigo-500" /> Cashflow
                  Analytics
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  Real-time vector tracking
                </p>
              </div>
            </div>
            {/* Height set explicitly to prevent container collapsing */}
            <div className="flex-grow w-full relative h-[350px]">
              <BalanceChart transactions={transactions} />
            </div>
          </motion.div>

          <motion.div
            className={`${chartCardClass} lg:col-span-5 xl:col-span-4 min-h-[500px] z-[40]`}>
            <h3 className="font-black text-slate-900 dark:text-white mb-8 italic uppercase text-[10px] tracking-[0.3em]">
              Allocation Split
            </h3>
            <div className="flex-grow w-full flex items-center justify-center">
              <CategoryChart transactions={transactions} />
            </div>
          </motion.div>
        </div>

        {/* 5. ADMIN SECTION (Lower z-index than charts) */}
        <AnimatePresence>
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full relative z-[10]">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-[1px] rounded-[3rem]">
                <div className="bg-[#F9F9F7] dark:bg-slate-950 rounded-[2.95rem] overflow-hidden">
                  <AddTransactionForm />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. INSIGHTS & TRANSACTIONS (Lowest z-index) */}
        <div className="space-y-8 relative z-[5]">
          <Insights transactions={transactions} />
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800 p-2 sm:p-8 shadow-2xl">
            <div className="px-4 py-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-xl">
                  <LayoutDashboard
                    size={18}
                    className="text-white dark:text-slate-900"
                  />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white italic uppercase text-xs tracking-[0.2em]">
                  Master Ledger
                </h3>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Protocol 4.0.2
              </span>
            </div>
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
}
