import React, { useState, useMemo } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  Trash2,
  Search,
  ArrowUpDown,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Inbox,
} from "lucide-react";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction, searchTerm, setSearchTerm } =
    useFinance();

  // Local states for UI control
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', 'expense'

  // --- CORE LOGIC: FILTERING & SORTING ---
  const processedData = useMemo(() => {
    // 1. Filter by Type
    let data = transactions.filter((t) => {
      if (filterType === "all") return true;
      return t.type?.toLowerCase() === filterType;
    });

    // 2. Sort Logic
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
  }, [transactions, sortConfig, filterType]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-md rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
      {/* --- TABLE HEADER & CONTROLS --- */}
      <div className="p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-50">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
            Live <span className="text-indigo-600">Registry</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Protocol Alpha • {processedData.length} Entries Localized
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Quick Filter Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterType === type
                    ? "bg-white text-indigo-600 shadow-sm shadow-indigo-100"
                    : "text-slate-400 hover:text-slate-600"
                }`}>
                {type}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by category or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th
                className="px-8 py-6 cursor-pointer hover:bg-slate-50 transition-colors group"
                onClick={() => requestSort("date")}>
                <div className="flex items-center gap-2">
                  <Calendar
                    size={14}
                    className={
                      sortConfig.key === "date" ? "text-indigo-600" : ""
                    }
                  />
                  Date Index
                  <ArrowUpDown
                    size={12}
                    className={`opacity-0 group-hover:opacity-100 ${sortConfig.key === "date" ? "opacity-100 text-indigo-600" : ""}`}
                  />
                </div>
              </th>
              <th
                className="px-8 py-6 cursor-pointer hover:bg-slate-50 transition-colors group"
                onClick={() => requestSort("category")}>
                <div className="flex items-center gap-2">
                  Category{" "}
                  <ArrowUpDown
                    size={12}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
              </th>
              <th className="px-8 py-6">Protocol Type</th>
              <th
                className="px-8 py-6 text-right cursor-pointer hover:bg-slate-50 transition-colors group"
                onClick={() => requestSort("amount")}>
                <div className="flex items-center justify-end gap-2">
                  Yield{" "}
                  <ArrowUpDown
                    size={12}
                    className="opacity-0 group-hover:opacity-100"
                  />
                </div>
              </th>
              {role === "admin" && (
                <th className="px-8 py-6 text-center">Termination</th>
              )}
            </tr>
          </thead>

          <tbody className="text-slate-600 font-medium">
            {processedData.length > 0 ? (
              processedData.map((t) => (
                <tr
                  key={t.id}
                  className="group border-b border-slate-50/50 hover:bg-indigo-50/30 transition-all duration-300">
                  <td className="px-8 py-5 text-xs tabular-nums text-slate-400 font-bold italic">
                    {new Date(t.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {t.category}
                      </span>
                     
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        t.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                      {t.type === "income" ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownLeft size={10} />
                      )}
                      {t.type}
                    </div>
                  </td>
                  <td
                    className={`px-8 py-5 text-right text-sm font-black tabular-nums ${
                      t.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                    {t.type === "income" ? "+" : "-"}₹
                    {t.amount.toLocaleString("en-IN")}
                  </td>

                  {role === "admin" && (
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2.5 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Inbox size={48} strokeWidth={1} />
                    <p className="text-xs font-black uppercase tracking-[0.5em]">
                      No Matching Data Found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
