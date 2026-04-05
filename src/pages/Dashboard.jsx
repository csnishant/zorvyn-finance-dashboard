import { useMemo } from "react";
import { useFinance } from "../hooks/useFinance";

// Components
import SummaryCards from "../features/dashboard/SummaryCards";
import TransactionTable from "../features/transactions/TransactionTable";
import Insights from "../features/dashboard/Insights";
import BalanceChart from "../features/charts/BalanceChart";
import CategoryChart from "../features/charts/CategoryChart";

// Animations & Icons
import { motion } from "framer-motion";
import { Calendar, Activity, Cpu } from "lucide-react";

export default function Dashboard() {
  const { transactions, timeRange, setTimeRange } = useFinance();

  // Helper: normalize type filtering
  const filterByType = (list, type) =>
    list.filter((t) => t.type?.toLowerCase() === type.toLowerCase());

  // Dashboard.jsx ke andar ye filter logic update karein
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Aaj ki date ka end point

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      // Din ka difference nikalne ka sahi tarika
      const diffTime = Math.abs(now - tDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeRange === "24H") return diffDays <= 1;
      if (timeRange === "7D") return diffDays <= 7;
      if (timeRange === "1M") return diffDays <= 30;
      if (timeRange === "1Y") return diffDays <= 365;

      return true;
    });
  }, [transactions, timeRange]);

  // CALCULATE TOTALS
  const totals = useMemo(() => {
    const income = filterByType(filteredTransactions, "income").reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    const expense = filterByType(filteredTransactions, "expense").reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  const timeOptions = ["24H", "7D", "1M", "1Y"];

  return (
    <div className="flex flex-col gap-10 w-full max-w-screen-2xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 pb-10 border-b border-white/[0.05] relative group/cmd">
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg shadow-glow">
              <Activity size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.6em] translate-y-0.5 italic">
              Session Reference v8.01
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-5xl">
            Registry <span className="text-brand-primary">Flux</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 px-8 py-4 glass rounded-2xl border border-white/5 hover:border-brand-primary/20 hover:bg-white/5 transition-all group/cal cursor-default">
          <Calendar
            size={20}
            className="text-brand-primary group-hover/cal:rotate-12 transition-transform"
          />
          <div className="flex flex-col leading-none items-start gap-1.5 translate-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 mb-0.5 leading-none italic">
              Session Date Index
            </span>
            <span className="text-lg font-black text-white tracking-widest uppercase italic tabular-nums leading-none">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* TIME RANGE BUTTONS */}
      <div className="flex gap-2">
        {timeOptions.map((t) => (
          <button
            key={t}
            onClick={() => setTimeRange(t)}
            className={`px-3 py-1 rounded-md text-xs font-bold ${
              timeRange === t
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* SUMMARY CARDS */}
      <SummaryCards totals={totals} />

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 flex flex-col gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-8 sm:p-10 h-[600px] shadow-premium border border-white/[0.04] group/visual relative overflow-hidden flex flex-col gap-10">
            <BalanceChart
              transactions={
                filteredTransactions.length > 0
                  ? filteredTransactions
                  : transactions
              }
            />
          </motion.div>
        </div>

        <div className="lg:col-span-4 flex flex-col h-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 h-full min-h-[600px] shadow-premium border border-white/[0.04] group/skew relative overflow-hidden flex flex-col gap-10">
            {/* Pass all transactions to always show expense data */}
            <CategoryChart transactions={transactions} />
          </motion.div>
        </div>
      </div>

      {/* INSIGHTS + TRANSACTION TABLE */}
      <Insights transactions={filteredTransactions} />
      <div className="w-full overflow-hidden">
        <TransactionTable />
      </div>

      {/* DECORATIVE CPU */}
      <div className="fixed bottom-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-10 transition-all duration-[4s]">
        <Cpu size={500} strokeWidth={1} className="rotate-45" />
      </div>
    </div>
  );
}
