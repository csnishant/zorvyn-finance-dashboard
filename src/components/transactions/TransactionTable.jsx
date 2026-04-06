import React, { useState, useMemo } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  Trash2,
  Search,
  ArrowUpDown,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Inbox,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction, searchTerm, setSearchTerm } =
    useFinance();

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterType, setFilterType] = useState("all");

  // --- CORE LOGIC ---
  const processedData = useMemo(() => {
    let data = transactions.filter((t) => {
      const matchesFilter =
        filterType === "all" || t.type?.toLowerCase() === filterType;
      const matchesSearch = t.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "date") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (sortConfig.key === "amount") {
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [transactions, sortConfig, filterType, searchTerm]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-2xl relative">
      {/* 1. Header & Controls */}
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
                Live <span className="text-indigo-500">Registry</span>
              </h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                {processedData.length} Nodes Synchronized
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Filter Pills */}
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              {["all", "income", "expense"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterType === type
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}>
                  {type}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 min-w-[280px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search encrypted data..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/40 border border-transparent focus:border-indigo-500/50 dark:focus:border-indigo-500/30 rounded-2xl text-xs font-bold text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100 dark:border-slate-800">
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => requestSort("date")}>
                <div className="flex items-center gap-2">
                  <Calendar size={13} /> Timestamp
                  <ArrowUpDown
                    size={12}
                    className={
                      sortConfig.key === "date"
                        ? "text-indigo-500"
                        : "opacity-30"
                    }
                  />
                </div>
              </th>
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => requestSort("category")}>
                <div className="flex items-center gap-2">
                  Category{" "}
                  <ArrowUpDown
                    size={12}
                    className={
                      sortConfig.key === "category"
                        ? "text-indigo-500"
                        : "opacity-30"
                    }
                  />
                </div>
              </th>
              <th className="px-8 py-6">Protocol</th>
              <th
                className="px-8 py-6 text-right cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => requestSort("amount")}>
                <div className="flex items-center justify-end gap-2">
                  Yield{" "}
                  <ArrowUpDown
                    size={12}
                    className={
                      sortConfig.key === "amount"
                        ? "text-indigo-500"
                        : "opacity-30"
                    }
                  />
                </div>
              </th>
              {role === "admin" && (
                <th className="px-8 py-6 text-center">
                  <ShieldCheck size={14} className="mx-auto" />
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            <AnimatePresence mode="popLayout">
              {processedData.length > 0 ? (
                processedData.map((t) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={t.id}
                    className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                    <td className="px-8 py-5 text-[11px] tabular-nums text-slate-400 font-bold italic">
                      {new Date(t.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight text-sm">
                      {t.category}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          t.type === "income"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}>
                        {t.type === "income" ? (
                          <ArrowUpRight size={10} />
                        ) : (
                          <ArrowDownLeft size={10} />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`px-8 py-5 text-right text-sm font-black tabular-nums ${
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}>
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString("en-IN")}
                    </td>
                    {role === "admin" && (
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all active:scale-90">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "admin" ? 5 : 4}
                    className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Inbox
                        size={64}
                        strokeWidth={1}
                        className="text-slate-400"
                      />
                      <p className="text-xs font-black uppercase tracking-[0.6em] dark:text-white">
                        Empty Registry
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
