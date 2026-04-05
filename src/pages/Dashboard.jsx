import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";

// Components
import SummaryCards from "../features/dashboard/SummaryCards";
import TransactionTable from "../features/transactions/TransactionTable";
import Insights from "../features/dashboard/Insights";
import BalanceChart from "../features/charts/BalanceChart";
import CategoryChart from "../features/charts/CategoryChart";
import AddTransactionForm from "../features/admin/AddTransactionForm";

// Animations & Icons
import { motion } from "framer-motion";
import { Calendar, Activity, Cpu } from "lucide-react";

export default function Dashboard() {
  // Context se filtered data directly uthao
  const { transactions, timeRange, setTimeRange } = useFinance();

  // Dashboard specific totals calculate karo (using already filtered data)
  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type?.toLowerCase() === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type?.toLowerCase() === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const timeOptions = ["24H", "7D", "1M", "1Y", "ALL"];

  return (
    <div className="flex flex-col gap-10 w-full max-w-screen-2xl mx-auto pb-24 px-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 py-10 border-b border-slate-200 relative group/cmd">
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 text-indigo-600 border border-indigo-600/20 rounded-lg">
              <Activity size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.6em] translate-y-0.5 italic">
              Registry v8.01
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Registry <span className="text-indigo-600">Flux</span>
          </h1>
        </div>

        {/* Date Card */}
        <div className="flex items-center gap-6 px-8 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-600/20 transition-all group/cal cursor-default">
          <Calendar
            size={20}
            className="text-indigo-600 group-hover/cal:rotate-12 transition-transform"
          />
          <div className="flex flex-col leading-none items-start gap-1.5 translate-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-0.5 leading-none italic">
              Session Date Index
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
      </div>

      {/* TIME RANGE SELECTOR */}
      <div className="flex gap-2 p-1 bg-slate-200/50 w-fit rounded-lg">
        {timeOptions.map((t) => (
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

      {/* SUMMARY CARDS */}
      <SummaryCards totals={totals} />

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 flex flex-col gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 sm:p-10 h-[600px] rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
            <BalanceChart transactions={transactions} />
          </motion.div>
        </div>

        <div className="lg:col-span-4 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 h-full min-h-[600px] rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
            <CategoryChart transactions={transactions} />
          </motion.div>
        </div>
      </div>

      <AddTransactionForm />

      {/* DATA & INSIGHTS */}
      <div className="flex flex-col gap-8">
        <Insights transactions={transactions} />
        <div className="w-full overflow-hidden bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <TransactionTable />
        </div>
      </div>

      {/* DECORATIVE BACKGROUND */}
      <div className="fixed bottom-0 right-0 p-10 opacity-[0.05] pointer-events-none">
        <Cpu size={500} strokeWidth={1} className="rotate-45 text-slate-900" />
      </div>
    </div>
  );
}
