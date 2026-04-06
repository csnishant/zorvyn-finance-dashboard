import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  Trash2,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Inbox,
  Zap,
  Download,
  FileJson,
  FileSpreadsheet,
  ChevronDown,
  X,
  SlidersHorizontal,
  ChevronsUpDown,
  ChevronUp,
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
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const exportRef = useRef(null);

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target))
        setIsExportOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const processedData = useMemo(() => {
    let data = transactions.filter((t) => {
      const matchesType =
        filterType === "all" || t.type?.toLowerCase() === filterType;
      const matchesSearch = t.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const tDate = new Date(t.date).getTime();
      const start = dateRange.start
        ? new Date(dateRange.start).getTime()
        : -Infinity;
      const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
      const matchesDate = tDate >= start && tDate <= end;
      const tAmount = Number(t.amount);
      const min = amountRange.min ? Number(amountRange.min) : 0;
      const max = amountRange.max ? Number(amountRange.max) : Infinity;
      const matchesAmount = tAmount >= min && tAmount <= max;

      return matchesType && matchesSearch && matchesDate && matchesAmount;
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
  }, [
    transactions,
    sortConfig,
    filterType,
    searchTerm,
    dateRange,
    amountRange,
  ]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setDateRange({ start: "", end: "" });
    setAmountRange({ min: "", max: "" });
    setFilterType("all");
    setSearchTerm("");
  };
  const SortIcon = ({ columnKey, sortConfig }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ChevronsUpDown
          size={12}
          className="opacity-20 group-hover:opacity-100"
        />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={12} className="text-indigo-600" />
    ) : (
      <ChevronDown size={12} className="text-indigo-600" />
    );
  };
  // CSV Export Logic
  const exportCSV = () => {
    const headers = ["Date,Category,Type,Amount\n"];
    const rows = processedData.map(
      (t) => `${t.date},${t.category},${t.type},${t.amount}`,
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Zorvyn_Transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    setIsExportOpen(false);
  };

  // JSON Export Logic
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(processedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Zorvyn_Data.json`;
    link.click();
    setIsExportOpen(false);
  };

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl  sm:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl relative overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-6">
          {/* Title & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl border border-indigo-500/20">
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white italic uppercase leading-none">
                  Transactions<span className="text-indigo-600">List</span>
                </h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                {processedData.length} Results
              </p>
            </div>
          </div>

          {/* SEARCH & PRIMARY FILTERS (MOBILE FRIENDLY) */}
          <div className="flex flex-col md:flex-row gap-3 w-full">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search category..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/40 border border-transparent focus:border-indigo-500/50 rounded-2xl text-xs font-bold outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all ${showAdvancedFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                <SlidersHorizontal size={18} />
                <span className="md:hidden text-[10px] font-black uppercase">
                  Filters
                </span>
              </button>

              <div className="relative flex-1 md:flex-none" ref={exportRef}>
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  <Download size={14} /> <span>Export</span>
                </button>
                {/* Export Dropdown AnimatePresence code remains same as your original */}
              </div>
            </div>
          </div>

          {/* CATEGORY PILLS (MOBILE SCROLLABLE) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  filterType === type
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ADVANCED FILTERS PANEL */}
        <AnimatePresence>
          {isExportOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-[100] backdrop-blur-xl">
              <div className="space-y-1">
                {/* CSV Option */}
                <button
                  onClick={exportCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all group">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                    <FileSpreadsheet size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">
                      Export CSV
                    </p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">
                      For Excel/Sheets
                    </p>
                  </div>
                </button>

                {/* JSON Option */}
                <button
                  onClick={exportJSON}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all group">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                    <FileJson size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">
                      Export JSON
                    </p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">
                      For Developers
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Date Start
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold outline-none border border-transparent focus:border-indigo-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Date End
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold outline-none border border-transparent focus:border-indigo-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 0"
                    value={amountRange.min}
                    onChange={(e) =>
                      setAmountRange({ ...amountRange, min: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold outline-none border border-transparent focus:border-indigo-500/30"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      placeholder="₹ 999k"
                      value={amountRange.max}
                      onChange={(e) =>
                        setAmountRange({ ...amountRange, max: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold outline-none border border-transparent focus:border-indigo-500/30"
                    />
                  </div>
                  <button
                    onClick={resetFilters}
                    className="p-3 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TABLE SECTION (Remains same but ensure horizontal scroll is active) */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          {/* ... existing table headers and body ... */}
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100 dark:border-slate-800">
              {/* Timestamp Column */}
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors group"
                onClick={() => requestSort("date")}>
                <div className="flex items-center gap-2">
                  Timestamp
                  <SortIcon columnKey="date" sortConfig={sortConfig} />
                </div>
              </th>

              {/* Category Column */}
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => requestSort("category")}>
                <div className="flex items-center gap-2">
                  Category
                  <SortIcon columnKey="category" sortConfig={sortConfig} />
                </div>
              </th>

              <th className="px-8 py-6">Protocol</th>

              {/* Yield (Amount) Column */}
              <th
                className="px-8 py-6 text-right cursor-pointer hover:text-indigo-500 transition-colors"
                onClick={() => requestSort("amount")}>
                <div className="flex items-center justify-end gap-2">
                  Yield
                  <SortIcon columnKey="amount" sortConfig={sortConfig} />
                </div>
              </th>

              {role === "admin" && (
                <th className="px-8 py-6 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {processedData.map((t) => (
              <motion.tr
                key={t.id}
                className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all">
                <td className="px-8 py-5 text-[11px] tabular-nums text-slate-400 font-bold italic">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-8 py-5 font-black text-slate-900 dark:text-slate-100 uppercase text-sm">
                  {t.category}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    {t.type === "income" ? (
                      <ArrowUpRight size={10} />
                    ) : (
                      <ArrowDownLeft size={10} />
                    )}{" "}
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-8 py-5 text-right text-sm font-black tabular-nums ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type === "income" ? "+" : "-"}₹
                  {t.amount.toLocaleString("en-IN")}
                </td>
                {role === "admin" && (
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
