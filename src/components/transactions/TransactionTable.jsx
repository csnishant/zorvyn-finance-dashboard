import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  Trash2,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Inbox,
  ShieldCheck,
  Zap,
  Download,
  FileJson,
  FileSpreadsheet,
  ChevronDown,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction, searchTerm, setSearchTerm } =
    useFinance();

  // --- STATES ---
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterType, setFilterType] = useState("all");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const exportRef = useRef(null);

  // Advanced Filter States
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

  // --- LOGIC: Advanced Filtering & Sorting ---
  const processedData = useMemo(() => {
    let data = transactions.filter((t) => {
      // 1. Basic Type Filter (Income/Expense)
      const matchesType =
        filterType === "all" || t.type?.toLowerCase() === filterType;

      // 2. Search Filter
      const matchesSearch = t.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 3. Date Range Filter
      const tDate = new Date(t.date).getTime();
      const start = dateRange.start
        ? new Date(dateRange.start).getTime()
        : -Infinity;
      const end = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
      const matchesDate = tDate >= start && tDate <= end;

      // 4. Amount Range Filter
      const tAmount = Number(t.amount);
      const min = amountRange.min ? Number(amountRange.min) : 0;
      const max = amountRange.max ? Number(amountRange.max) : Infinity;
      const matchesAmount = tAmount >= min && tAmount <= max;

      return matchesType && matchesSearch && matchesDate && matchesAmount;
    });

    // Sorting Logic
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

  // --- ACTIONS ---
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

  // --- EXPORT FUNCTIONS ---
  const exportToCSV = () => {
    if (!processedData.length) return alert("No data to export");
    const headers = ["Date", "Category", "Type", "Amount"];
    const rows = processedData.map((t) =>
      [
        new Date(t.date).toLocaleDateString(),
        `"${t.category}"`,
        t.type,
        t.amount,
      ].join(","),
    );
    const csvContent = "\ufeff" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Zorvyn_Report_${Date.now()}.csv`;
    link.click();
  };
  // --- NEW: JSON EXPORT FUNCTION ---
  const exportToJSON = () => {
    if (!processedData.length) return alert("No data to export");

    // Filtered data ko JSON string mein convert karna
    const dataStr = JSON.stringify(processedData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Zorvyn_Data_Export_${Date.now()}.json`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-2xl relative overflow-hidden">
      {/* 1. Header & Primary Controls */}
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 relative z-50">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl border border-indigo-500/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">
                Transactions<span className="text-indigo-600">List</span>
              </h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1.5">
                {processedData.length} Nodes Filtered
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search category..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/40 border border-transparent focus:border-indigo-500/50 rounded-2xl text-xs font-bold outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Advanced Filter Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-3 rounded-2xl border transition-all ${showAdvancedFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"}`}>
              <SlidersHorizontal size={18} />
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Download size={14} /> Export{" "}
                <ChevronDown
                  size={12}
                  className={isExportOpen ? "rotate-180" : ""}
                />
              </button>

              <AnimatePresence>
                {isExportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] p-2">
                    {/* CSV Button */}
                    <button
                      onClick={() => {
                        exportToCSV();
                        setIsExportOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors">
                      <FileSpreadsheet size={16} className="text-emerald-500" />
                      CSV Spreadsheet
                    </button>

                    {/* JSON Button */}
                    <button
                      onClick={() => {
                        exportToJSON();
                        setIsExportOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors">
                      <FileJson size={16} className="text-amber-500" />
                      JSON Data File
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 2. Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-100/50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Date Start
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Date End
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Min Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={amountRange.min}
                    onChange={(e) =>
                      setAmountRange({ ...amountRange, min: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none text-xs font-bold"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Max Amount
                    </label>
                    <input
                      type="number"
                      placeholder="999999"
                      value={amountRange.max}
                      onChange={(e) =>
                        setAmountRange({ ...amountRange, max: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border-none text-xs font-bold"
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

        {/* 3. Filter Pills */}
        <div className="flex gap-2 mt-6">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Table Body */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100 dark:border-slate-800">
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500"
                onClick={() => requestSort("date")}>
                Timestamp
              </th>
              <th
                className="px-8 py-6 cursor-pointer hover:text-indigo-500"
                onClick={() => requestSort("category")}>
                Category
              </th>
              <th className="px-8 py-6">Protocol</th>
              <th
                className="px-8 py-6 text-right cursor-pointer hover:text-indigo-500"
                onClick={() => requestSort("amount")}>
                Yield
              </th>
              {role === "admin" && (
                <th className="px-8 py-6 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            <AnimatePresence mode="popLayout">
              {processedData.map((t) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
            </AnimatePresence>
          </tbody>
        </table>
        {processedData.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Inbox size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              No matching records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
