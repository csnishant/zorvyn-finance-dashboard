import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";
import { motion } from "framer-motion";
import { Activity, Calendar } from "lucide-react";

// Components
import SummaryCards from "../components/dashboard/SummaryCards";
import TransactionTable from "../components/transactions/TransactionTable";
import Insights from "../components/dashboard/Insights";
import BalanceChart from "../components/visualizations/BalanceChart";
import CategoryChart from "../components/visualizations/CategoryChart";
import AddTransactionForm from "../components/admin/AddTransactionForm";

// Premium Minimalist Flower SVG Component
const FloralDecorative = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    {/* Minimalist Rose Outline */}
    <path d="M50 90C50 90 50 60 50 40C50 30 60 20 70 25C80 30 75 45 60 50C45 55 35 45 40 30C45 15 65 10 80 20M50 40C50 40 40 30 30 35C20 40 25 55 40 60C55 65 65 55 60 40C55 25 35 20 20 30" />
    <path d="M50 90C50 90 30 80 20 70C10 60 15 50 30 55M50 90C50 90 70 80 80 70C90 60 85 50 70 55" />
    <circle cx="50" cy="90" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export default function Dashboard() {
  const { transactions, role, timeRange, setTimeRange } = useFinance();

  // Data Calculations
  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type?.toLowerCase() === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type?.toLowerCase() === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  return (
    // 🎨 Theme: Changed background to cream-light and added a subtle gradient
    <div className="flex flex-col gap-10 w-full max-w-screen-2xl mx-auto pb-24 px-6 bg-[#FFFDF5] relative min-h-screen overflow-hidden">
      {/* Soft gradient overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-rose-50/10 pointer-events-none z-0" />

      {/* 1. Header (Updated backdrop to match cream theme) */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 py-10 border-b border-gray-100 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 text-indigo-600 border border-indigo-600/20 rounded-lg">
              <Activity size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.6em] italic">
              Registry v8.01 {role === "viewer" && "• READ-ONLY"}
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Registry <span className="text-indigo-600">Flux</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm cursor-default">
          <Calendar size={20} className="text-indigo-600" />
          <div className="flex flex-col leading-none items-start gap-1.5 translate-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
              Index Date
            </span>
            <span className="text-lg font-black text-slate-900 tracking-widest uppercase italic tabular-nums leading-none">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Content wrapper to ensure z-index priority over background decorations */}
      <div className="relative z-10 flex flex-col gap-10">
        {/* 2. Filters */}
        <div className="flex gap-2 p-1 bg-slate-200/50 w-fit rounded-lg">
          {["24H", "7D", "1M", "1Y", "ALL"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                timeRange === t
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}>
              {t}
            </button>
          ))}
        </div>

        <SummaryCards totals={totals} />

        {/* 3. Charts (Added subtle shadow boost to stand out on cream) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white/80 backdrop-blur-sm p-8 sm:p-10 h-[600px] rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
            <BalanceChart transactions={transactions} />
          </div>
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-sm p-8 h-full min-h-[600px] rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
            <CategoryChart transactions={transactions} />
          </div>
        </div>

        {/* 🛡️ 4. Form (Hide if not Admin) */}
        {role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20">
            <AddTransactionForm />
          </motion.div>
        )}

        {/* 5. Data View */}
        <div className="flex flex-col gap-8">
          <Insights transactions={transactions} />
          <div className="w-full overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 shadow-sm">
            <TransactionTable />
          </div>
        </div>
      </div>

      {/* 🌸 6. Floral Decoration (Bottom Right, Replacing CPU) */}
      <div className="fixed bottom-0 right-0 p-10 opacity-[0.06] pointer-events-none group-hover:opacity-10 transition-opacity duration-1000 z-0">
        <FloralDecorative className="w-[500px] h-[500px] text-indigo-900 rotate-12" />
      </div>

      {/* Secondary decoration for balance */}
      <div className="fixed -top-10 -left-10 p-10 opacity-[0.03] pointer-events-none z-0">
        <FloralDecorative className="w-[300px] h-[300px] text-rose-900 -rotate-12" />
      </div>
    </div>
  );
}
